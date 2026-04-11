import { ProductType, type Brand, type Category } from '@/types';

export type CollectionLandingConfig = {
  slug: string;
  productType: ProductType;
  title: string;
  shortTitle: string;
  description: string;
  metaDescription: string;
  faq: Array<{ question: string; answer: string }>;
};

export const COLLECTION_LANDING_PAGES: CollectionLandingConfig[] = [
  {
    slug: 'iphone',
    productType: ProductType.IPHONE,
    title: 'iPhone cũ đẹp, iPhone mới giá tốt',
    shortTitle: 'iPhone',
    description:
      'Khám phá iPhone mới, iPhone like new 99% và các phiên bản hot theo từng tầm giá. Trang đích này tập trung vào máy đẹp, hiệu năng ổn định, pin tốt và hỗ trợ lên đời dễ dàng.',
    metaDescription:
      'Mua iPhone mới và iPhone cũ đẹp giá tốt tại Nguyen Cong Mobile. Nhiều lựa chọn theo ngân sách, bảo hành rõ ràng, hỗ trợ thu cũ đổi mới.',
    faq: [
      {
        question: 'Nên mua iPhone mới hay iPhone 99%?',
        answer: 'Nếu cần tối ưu chi phí, iPhone 99% là lựa chọn tốt; nếu ưu tiên pin và ngoại hình tuyệt đối, iPhone mới sẽ phù hợp hơn.',
      },
      {
        question: 'Có hỗ trợ thu cũ đổi mới khi mua iPhone không?',
        answer: 'Nguyen Cong Mobile hỗ trợ tư vấn lên đời máy và trade-in để khách dễ chọn được phiên bản phù hợp ngân sách.',
      },
    ],
  },
  {
    slug: 'ipad',
    productType: ProductType.IPAD,
    title: 'iPad học tập, giải trí và làm việc linh hoạt',
    shortTitle: 'iPad',
    description:
      'Tổng hợp iPad phù hợp cho học sinh, sinh viên, người đi làm và nhu cầu giải trí tại nhà. Trang tập trung vào các mẫu dễ chọn theo màn hình, hiệu năng và ngân sách.',
    metaDescription:
      'Chọn iPad phù hợp cho học tập, ghi chú, giải trí và công việc. Nhiều đời máy, giá tốt, hỗ trợ tư vấn nhanh tại Nguyen Cong Mobile.',
    faq: [
      {
        question: 'iPad nào phù hợp cho học sinh, sinh viên?',
        answer: 'Các mẫu iPad tiêu chuẩn hoặc iPad Air thường là lựa chọn cân bằng giữa giá, hiệu năng và thời lượng sử dụng.',
      },
      {
        question: 'Có nên chọn iPad cũ để tiết kiệm chi phí?',
        answer: 'Nếu máy còn ngoại hình đẹp, pin ổn và đủ nhu cầu học tập, iPad cũ là lựa chọn rất kinh tế.',
      },
    ],
  },
  {
    slug: 'macbook',
    productType: ProductType.MACBOOK,
    title: 'MacBook cho học tập, văn phòng và sáng tạo nội dung',
    shortTitle: 'MacBook',
    description:
      'Landing page dành cho người cần MacBook ổn định để học tập, làm việc văn phòng, thiết kế hay dựng nội dung. Tập trung vào máy hiệu năng tốt, ngoại hình đẹp và dễ lên đời.',
    metaDescription:
      'Khám phá MacBook giá tốt cho sinh viên, dân văn phòng và creator. Nhiều tùy chọn theo nhu cầu, tư vấn nhanh, bảo hành rõ ràng.',
    faq: [
      {
        question: 'MacBook nào phù hợp cho sinh viên?',
        answer: 'Các dòng MacBook Air là lựa chọn phổ biến nhờ trọng lượng nhẹ, pin tốt và hiệu năng đủ mạnh cho hầu hết nhu cầu học tập.',
      },
      {
        question: 'Nên ưu tiên RAM, SSD hay chip khi mua MacBook?',
        answer: 'Hãy chọn theo phần mềm bạn dùng mỗi ngày; học tập và văn phòng ưu tiên tính ổn định, còn thiết kế và dựng video nên ưu tiên cấu hình mạnh hơn.',
      },
    ],
  },
  {
    slug: 'apple-watch',
    productType: ProductType.WATCH,
    title: 'Apple Watch theo dõi sức khỏe và luyện tập tiện lợi',
    shortTitle: 'Apple Watch',
    description:
      'Apple Watch dành cho người cần theo dõi vận động, nhận thông báo nhanh và đồng bộ tốt với hệ sinh thái Apple. Có nhiều lựa chọn từ cơ bản đến nâng cao.',
    metaDescription:
      'Tìm Apple Watch phù hợp cho luyện tập, sức khỏe và sử dụng hằng ngày. Giá tốt, hàng đẹp, hỗ trợ tư vấn nhanh tại Nguyen Cong Mobile.',
    faq: [
      {
        question: 'Apple Watch có phù hợp để tập luyện mỗi ngày không?',
        answer: 'Apple Watch rất phù hợp cho việc đo nhịp tim, theo dõi vận động, giấc ngủ và nhận thông báo tiện lợi trong ngày.',
      },
      {
        question: 'Nên chọn Apple Watch theo nhu cầu nào?',
        answer: 'Nếu cần tính năng cơ bản và giá dễ tiếp cận, hãy chọn dòng phổ thông; nếu cần nhiều cảm biến và độ bền cao hơn, có thể cân nhắc các dòng cao hơn.',
      },
    ],
  },
  {
    slug: 'airpods',
    productType: ProductType.AIRPODS,
    title: 'AirPods chính hãng, kết nối nhanh và nghe ổn định',
    shortTitle: 'AirPods',
    description:
      'Trang đích cho AirPods và tai nghe Apple, phù hợp với người cần kết nối nhanh, mic ổn, chống ồn và trải nghiệm đồng bộ trong hệ sinh thái Apple.',
    metaDescription:
      'Mua AirPods chính hãng, kết nối nhanh, nghe ổn định và nhiều lựa chọn theo ngân sách tại Nguyen Cong Mobile.',
    faq: [
      {
        question: 'AirPods nào phù hợp để đàm thoại và làm việc?',
        answer: 'Những mẫu có mic tốt và chống ồn chủ động sẽ phù hợp hơn nếu bạn họp online hoặc di chuyển thường xuyên.',
      },
      {
        question: 'Có nên mua AirPods theo ngân sách không?',
        answer: 'Có, vì AirPods có nhiều phiên bản khác nhau; hãy chọn theo nhu cầu nghe nhạc, gọi thoại hoặc chống ồn để tối ưu chi phí.',
      },
    ],
  },
  {
    slug: 'phu-kien',
    productType: ProductType.ACCESSORIES,
    title: 'Phụ kiện Apple cần thiết cho trải nghiệm trọn vẹn',
    shortTitle: 'Phụ kiện Apple',
    description:
      'Tập hợp sạc, cáp, ốp, bàn phím, phụ kiện bảo vệ và nâng cấp trải nghiệm cho iPhone, iPad, MacBook và Apple Watch.',
    metaDescription:
      'Khám phá phụ kiện Apple hữu ích: sạc, cáp, bảo vệ máy và thiết bị đi kèm cho iPhone, iPad, MacBook, Apple Watch.',
    faq: [
      {
        question: 'Phụ kiện nào nên mua cùng iPhone hoặc iPad?',
        answer: 'Những món cơ bản nhất thường là cáp, sạc, ốp và phụ kiện bảo vệ màn hình để tối ưu trải nghiệm ngay từ đầu.',
      },
      {
        question: 'Có phụ kiện nào phù hợp để làm quà tặng không?',
        answer: 'Tai nghe, sạc nhanh, ốp chất lượng và các phụ kiện tiện ích là nhóm rất phù hợp để làm quà cho người dùng Apple.',
      },
    ],
  },
];

export function getCollectionLandingPage(slug: string): CollectionLandingConfig | null {
  return COLLECTION_LANDING_PAGES.find((collection) => collection.slug === slug) || null;
}

export function buildCategoryMetaDescription(category: Category): string {
  return category.description?.trim()
    || `Khám phá ${category.name} chính hãng và máy đẹp giá tốt tại Nguyen Cong Mobile. Nhiều lựa chọn theo nhu cầu, hỗ trợ nhanh và bảo hành rõ ràng.`;
}

export function buildBrandMetaDescription(brand: Brand): string {
  return brand.description?.trim()
    || `Xem các sản phẩm ${brand.name} đang có tại Nguyen Cong Mobile. Giá tốt, danh mục rõ ràng, hỗ trợ tư vấn nhanh và giao hàng tiện lợi.`;
}
