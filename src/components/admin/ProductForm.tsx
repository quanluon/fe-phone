"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Tag,
  Button,
  Popover,
  message,
  Space,
  Card,
  Tabs,
  Divider,
  Row,
  Col,
  Typography,
} from "antd";
import {
  SparklesIcon,
  PhotoIcon,
  ListBulletIcon,
  TagIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Product,
  ProductStatus,
  ProductType,
  Category,
  Brand,
  ProductVariant,
} from "@/types";
import {
  adminProductsApi,
  adminCategoriesApi,
  adminBrandsApi,
} from "@/lib/api/admin";
import ImageUpload from "./ImageUpload";
import RichText from "./RichText";

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const PRODUCT_FORM_DRAFT_KEY = "admin-product-ai-draft-v1";

interface CompactToggleProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
  label: string;
  activeColor?: string;
}

const CompactToggle = ({
  value = false,
  onChange,
  label,
  activeColor = "#1890ff",
}: CompactToggleProps) => (
  <div
    onClick={() => onChange?.(!value)}
    style={{
      cursor: "pointer",
      padding: "0 10px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: 500,
      border: `1px solid ${value ? activeColor : "#d9d9d9"}`,
      color: value ? activeColor : "#8c8c8c",
      backgroundColor: value ? `${activeColor}12` : "#fff",
      transition: "all 0.2s",
      userSelect: "none",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      height: "28px",
    }}
  >
    <div
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        backgroundColor: value ? activeColor : "#d9d9d9",
        transition: "all 0.2s",
      }}
    />
    {label}
  </div>
);

export interface ProductFormProps {
  initialData?: Product;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  loading?: boolean;
}

type ProductVariantFormValues = Omit<
  Partial<ProductVariant>,
  | "storage"
  | "size"
  | "connectivity"
  | "simType"
  | "originalPrice"
  | "images"
  | "attributes"
> & {
  storage?: string | null;
  size?: string | null;
  connectivity?: string | null;
  simType?: string | null;
  originalPrice?: number | null;
  images?: string[] | null;
  attributes?: ProductVariant["attributes"];
};

export type ProductFormValues = Omit<
  Partial<Product>,
  "shortDescription" | "originalBasePrice" | "variants" | "attributes" | "images"
> & {
  shortDescription?: string | null;
  originalBasePrice?: number | null;
  variants?: ProductVariantFormValues[];
  attributes?: Product["attributes"];
  images?: string[];
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatSlugTimestamp(date = new Date()) {
  const pad = (value: number) => String(value).padStart(2, "0");

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("");
}

function buildUniqueProductSlug(baseValue?: string | null) {
  return `${toSlug(baseValue || "product")}-${formatSlugTimestamp()}`;
}

function normalizeVariant(variant: ProductVariantFormValues) {
  return {
    name: variant?.name ?? "",
    color: variant?.color ?? "",
    colorCode: variant?.colorCode ?? "#000000",
    storage: variant?.storage ?? null,
    size: variant?.size ?? null,
    connectivity: variant?.connectivity ?? null,
    simType: variant?.simType ?? null,
    price: variant?.price ?? 0,
    originalPrice: variant?.originalPrice ?? null,
    stock: variant?.stock ?? 0,
    images: Array.isArray(variant?.images) ? variant.images : [],
    attributes: Array.isArray(variant?.attributes) ? variant.attributes : [],
    isActive: variant?.isActive ?? true,
  };
}

function normalizeFormValues(values: ProductFormValues): ProductFormValues {
  return {
    ...values,
    shortDescription: values.shortDescription ?? null,
    originalBasePrice: values.originalBasePrice ?? values.basePrice ?? null,
    images: Array.isArray(values.images) ? values.images : [],
    features: Array.isArray(values.features) ? values.features : [],
    tags: Array.isArray(values.tags) ? values.tags : [],
    attributes: Array.isArray(values.attributes) ? values.attributes : [],
    variants: Array.isArray(values.variants)
      ? values.variants.map(normalizeVariant)
      : [],
  };
}

function saveProductFormDraft(values: ProductFormValues) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      PRODUCT_FORM_DRAFT_KEY,
      JSON.stringify(normalizeFormValues(values)),
    );
  } catch {
    // Ignore storage failures and keep the form usable.
  }
}

function loadProductFormDraft(): ProductFormValues | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawDraft = window.localStorage.getItem(PRODUCT_FORM_DRAFT_KEY);
    if (!rawDraft) {
      return null;
    }

    return normalizeFormValues(JSON.parse(rawDraft) as ProductFormValues);
  } catch {
    return null;
  }
}

function clearProductFormDraft() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(PRODUCT_FORM_DRAFT_KEY);
  } catch {
    // Ignore storage failures and keep the form usable.
  }
}

export default function ProductForm({
  initialData,
  onSubmit,
  loading = false,
}: ProductFormProps) {
  const [form] = Form.useForm();
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiPopoverVisible, setAiPopoverVisible] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [metaLoading, setMetaLoading] = useState(false);
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

  // Fetch metadata
  useEffect(() => {
    const fetchMeta = async () => {
      setMetaLoading(true);
      try {
        const [catsRes, brandsRes] = await Promise.all([
          adminCategoriesApi.getAll(),
          adminBrandsApi.getAll(),
        ]);
        setCategories(catsRes.data || []);
        setBrands(brandsRes.data || []);
      } catch {
        message.error("Không thể tải danh mục hoặc thương hiệu");
      } finally {
        setMetaLoading(false);
      }
    };
    fetchMeta();
  }, []);

  // Set initial data
  useEffect(() => {
    if (initialData) {
      clearProductFormDraft();
      form.setFieldsValue({
        ...initialData,
        category: initialData.category?._id || initialData.category,
        brand: initialData.brand?._id || initialData.brand,
      });
    } else {
      form.setFieldsValue({
        status: ProductStatus.DRAFT,
        isFeatured: false,
        isNew: true,
        productType: ProductType.IPHONE,
        slug: buildUniqueProductSlug(),
        variants: [
          {
            name: "Tiêu chuẩn",
            color: "Đen",
            colorCode: "#000000",
            price: 0,
            stock: 10,
            isActive: true,
          },
        ],
      });
    }
  }, [initialData, form]);

  useEffect(() => {
    if (initialData || hasRestoredDraft) {
      return;
    }

    const savedDraft = loadProductFormDraft();
    if (!savedDraft) {
      setHasRestoredDraft(true);
      return;
    }

    form.setFieldsValue(savedDraft);
    setHasRestoredDraft(true);
    message.info("Đã khôi phục dữ liệu AI extract từ lần trước.");
  }, [form, hasRestoredDraft, initialData]);

  const handleFinish = async () => {
    const values = normalizeFormValues(form.getFieldsValue(true));
    if (!initialData) {
      values.slug = buildUniqueProductSlug(values.slug || values.name);
    }
    await onSubmit(values);
    clearProductFormDraft();
  };

  const handleAiAutoFill = async () => {
    if (!aiPrompt.trim()) {
      message.error("Vui lòng nhập Link hoặc nội dung mô tả");
      return;
    }
    setAiLoading(true);
    try {
      const resData = await adminProductsApi.aiExtract({
        promptText: aiPrompt,
      });

      if (!resData.success) {
        throw new Error(resData.message || "AI Extract Failed");
      }

      const extracted = resData.data;
      const { _validationErrors, ...productFields } = extracted;
      const normalizedFields = normalizeFormValues(productFields);
      const imageCount = normalizedFields.images?.length ?? 0;
      const variantCount = normalizedFields.variants?.length ?? 0;
      const attributeCount = normalizedFields.attributes?.length ?? 0;

      // Update form fields
      const nextValues = {
        ...normalizedFields,
        slug: initialData
          ? normalizedFields.slug
          : buildUniqueProductSlug(normalizedFields.slug || normalizedFields.name),
        status: ProductStatus.DRAFT,
      };

      form.setFieldsValue(nextValues);
      if (!initialData) {
        saveProductFormDraft(nextValues);
      }

      if (_validationErrors?.length) {
        message.warning(
          `AI đã điền dữ liệu: ${imageCount} ảnh, ${variantCount} biến thể, ${attributeCount} thông số. Còn một số lỗi validation, vui lòng kiểm tra lại.`,
        );
      } else {
        message.success(
          `Đã bóc tách dữ liệu bằng AI: ${imageCount} ảnh, ${variantCount} biến thể, ${attributeCount} thông số.`,
        );
      }

      setAiPopoverVisible(false);
      setAiPrompt("");
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "Lỗi bóc tách AI";
      message.error(errorMsg);
    } finally {
      setAiLoading(false);
    }
  };

  const aiContent = (
    <div style={{ width: 400 }}>
      <p style={{ marginBottom: 8, fontSize: 13, color: "#666" }}>
        Dán Link sản phẩm hoặc nội dung thông số vào đây. AI sẽ tự động tải ảnh
        lên S3 và điền toàn bộ Form cho bạn:
      </p>
      <TextArea
        rows={6}
        value={aiPrompt}
        onChange={(e) => setAiPrompt(e.target.value)}
        placeholder="https://..."
      />
      <div
        style={{
          marginTop: 12,
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
        }}
      >
        <Button size="small" onClick={() => setAiPopoverVisible(false)}>
          Huỷ
        </Button>
        <Button
          type="primary"
          size="small"
          loading={aiLoading}
          onClick={handleAiAutoFill}
          className="bg-[linear-gradient(90deg,#8E2DE2_0%,#4A00E0_100%)] border-0"
        >
          <SparklesIcon
            style={{ width: 14, marginRight: 4, display: "inline-block" }}
          />
          Phân tích & Tải ảnh
        </Button>
      </div>
    </div>
  );

  const tabItems = [
    {
      key: "basic",
      forceRender: true,
      label: (
        <span>
          <InformationCircleIcon className="w-4 h-4 inline-block mr-1" />
          Thông tin cơ bản
        </span>
      ),
      children: (
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            >
              <Input
                placeholder="Ví dụ: iPhone 15 Pro Max"
                size="large"
                onChange={(event) => {
                  if (initialData || isSlugTouched) return;
                  form.setFieldValue(
                    "slug",
                    buildUniqueProductSlug(event.target.value),
                  );
                }}
              />
            </Form.Item>

            <Form.Item
              name="slug"
              label="Slug (Đường dẫn)"
              rules={[{ required: true, message: "Vui lòng nhập slug" }]}
            >
              <Input
                placeholder="ví-dụ-iphone-15-pro-max"
                onChange={() => setIsSlugTouched(true)}
              />
            </Form.Item>

            <Form.Item name="shortDescription" label="Mô tả ngắn">
              <TextArea
                rows={2}
                placeholder="Tóm tắt ngắn gọn về sản phẩm..."
              />
            </Form.Item>

            <Form.Item name="description" label="Nội dung chi tiết (HTML)">
              <RichText placeholder="Mô tả chi tiết sản phẩm..." />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Card title="Phân loại & Giá" size="small" className="mb-4">
              <Form.Item
                name="productType"
                label="Loại sản phẩm"
                rules={[{ required: true }]}
              >
                <Select>
                  {Object.values(ProductType).map((type) => (
                    <Option key={type} value={type}>
                      {type.toUpperCase()}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true }]}
              >
                <Select loading={metaLoading} placeholder="Chọn danh mục">
                  {categories.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="brand"
                label="Thương hiệu"
                rules={[{ required: true }]}
              >
                <Select loading={metaLoading} placeholder="Chọn thương hiệu">
                  {brands.map((b) => (
                    <Option key={b._id} value={b._id}>
                      {b.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="basePrice"
                label="Giá cơ bản (₫)"
                rules={[{ required: true }]}
              >
                <InputNumber<number>
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(v) =>
                    `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(v) => Number(v?.replace(/\$\s?|(,*)/g, ""))}
                />
              </Form.Item>

              <Form.Item
                name="originalBasePrice"
                label="Giá niêm yết cơ bản (₫)"
              >
                <InputNumber<number>
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(v) =>
                    `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(v) => Number(v?.replace(/\$\s?|(,*)/g, ""))}
                  placeholder="Giá bán chưa giảm..."
                />
              </Form.Item>
            </Card>

            <Card title="Trạng thái" size="small">
              <Form.Item name="status" label="Trạng thái">
                <Select>
                  <Option value={ProductStatus.ACTIVE}>
                    <Tag color="green">Đang bán</Tag>
                  </Option>
                  <Option value={ProductStatus.INACTIVE}>
                    <Tag color="red">Ẩn</Tag>
                  </Option>
                  <Option value={ProductStatus.DRAFT}>
                    <Tag color="default">Nháp</Tag>
                  </Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: "images",
      forceRender: true,
      label: (
        <span>
          <PhotoIcon className="w-4 h-4 inline-block mr-1" />
          Hình ảnh
        </span>
      ),
      children: (
        <Card
          title="Bộ sưu tập hình ảnh"
          extra={<Text type="secondary">Ảnh đầu tiên sẽ là ảnh đại diện</Text>}
        >
          <Form.Item name="images">
            <ImageUpload maxCount={10} />
          </Form.Item>
          <Divider />
          <Text type="secondary">
            Mẹo: Bạn có thể nhập link thủ công vào AI Auto-fill để hệ thống tự
            động tải ảnh về S3.
          </Text>
        </Card>
      ),
    },
    {
      key: "variants",
      forceRender: true,
      label: (
        <span>
          <TagIcon className="w-4 h-4 inline-block mr-1" />
          Biến thể
        </span>
      ),
      children: (
        <Form.List name="variants">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  size="small"
                  className="mb-4"
                  title={`Biến thể #${name + 1}`}
                  extra={
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    />
                  }
                >
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        label="Tên biến thể"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="iPhone 15 Pro Max - Xanh" />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...restField}
                        name={[name, "color"]}
                        label="Màu sắc"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="Xanh" />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...restField}
                        name={[name, "colorCode"]}
                        label="Mã màu"
                      >
                        <Input placeholder="#000000" />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...restField}
                        name={[name, "price"]}
                        label="Giá (₫)"
                        rules={[{ required: true }]}
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          formatter={(v) =>
                            `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...restField}
                        name={[name, "originalPrice"]}
                        label="Giá niêm yết"
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          formatter={(v) =>
                            `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item
                        {...restField}
                        name={[name, "stock"]}
                        label="Tồn kho"
                        rules={[{ required: true }]}
                      >
                        <InputNumber style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    {...restField}
                    name={[name, "images"]}
                    label="Ảnh của biến thể"
                  >
                    <ImageUpload maxCount={5} folder="products/variants" />
                  </Form.Item>
                </Card>
              ))}
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Thêm biến thể
              </Button>
            </>
          )}
        </Form.List>
      ),
    },
    {
      key: "attributes",
      forceRender: true,
      label: (
        <span>
          <ListBulletIcon className="w-4 h-4 inline-block mr-1" />
          Thông số kỹ thuật
        </span>
      ),
      children: (
        <Form.List name="attributes">
          {(fields, { add, remove }) => (
            <>
              <Row gutter={16} className="mb-2 font-bold px-4">
                <Col span={6}>Nhóm</Col>
                <Col span={8}>Tên thông số</Col>
                <Col span={8}>Giá trị</Col>
                <Col span={2}></Col>
              </Row>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  className="flex gap-4 mb-2 p-4 border rounded hover:bg-gray-50 transition-colors"
                >
                  <Col span={6}>
                    <Form.Item {...restField} name={[name, "category"]} noStyle>
                      <Input placeholder="Màn hình" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...restField} name={[name, "name"]} noStyle>
                      <Input placeholder="Độ phân giải" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...restField} name={[name, "value"]} noStyle>
                      <Input placeholder="2K+" />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    />
                  </Col>
                </div>
              ))}
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                className="mt-4"
              >
                Thêm thông số
              </Button>
            </>
          )}
        </Form.List>
      ),
    },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      onValuesChange={(_, allValues) => {
        if (initialData) {
          return;
        }

        saveProductFormDraft(allValues as ProductFormValues);
      }}
      className="product-form max-w-[1200px] mx-auto pb-20"
      initialValues={{
        isFeatured: false,
        isNew: false,
        productType: ProductType.MACBOOK,
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} style={{ marginBottom: 4 }}>
            {initialData ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm mới"}
          </Title>
          <Text type="secondary">
            Điền đầy đủ các thông tin dưới đây để đăng bán sản phẩm
          </Text>
        </div>
        <Space size="large">
          <div className="flex gap-2">
            <Form.Item name="isFeatured" valuePropName="value" noStyle>
              <CompactToggle label="Nổi bật" activeColor="#faad14" />
            </Form.Item>
            <Form.Item name="isNew" valuePropName="value" noStyle>
              <CompactToggle label="Mới" activeColor="#1890ff" />
            </Form.Item>
          </div>

          {!initialData && (
            <Popover
              content={aiContent}
              title="🪄 Magic AI Extract"
              trigger="click"
              open={aiPopoverVisible}
              onOpenChange={setAiPopoverVisible}
              placement="bottomRight"
            >
              <Button
                type="dashed"
                size="large"
                className="hover:border-purple-500 hover:text-purple-600 border-2"
              >
                <SparklesIcon className="w-5 h-5 mr-2 text-purple-600 animate-pulse" />
                Magic AI Auto-fill
              </Button>
            </Popover>
          )}
          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={() => form.submit()}
            className="px-10 bg-[linear-gradient(90deg,#00C6FF_0%,#0072FF_100%)] border-0"
          >
            Lưu sản phẩm
          </Button>
        </Space>
      </div>

      <Tabs
        type="card"
        items={tabItems}
        className="bg-white p-6 rounded-xl shadow-sm border"
      />
    </Form>
  );
}
