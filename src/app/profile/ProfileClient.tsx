"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  useProfile,
  useUpdateProfile,
  useChangePassword,
} from "@/hooks/useAuth";
import { useToastStore } from "@/stores/toast";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { FileUpload } from "@/components/ui/FileUpload";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  PencilIcon,
  KeyIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export function ProfileClient() {
  const t = useTranslations();
  const router = useRouter();
  const { addToast } = useToastStore();
  
  // Use auth guard to handle authentication safely
  const { isAuthenticated, isLoading } = useAuthGuard();

  const { data: user, isLoading: profileLoading } = useProfile();

  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Initialize form data when user data loads
  useEffect(() => {
    if (user && !isEditingProfile && formData.firstName === "") {
      setFormData({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: user?.phone || "",
      });
    }
  }, [user, isEditingProfile, formData.firstName]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect via useAuthGuard)
  if (!isAuthenticated) {
    return null;
  }

  const handleProfileEdit = () => {
    setIsEditingProfile(true);
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
    });
  };

  const handleProfileSave = async () => {
    try {
      await updateProfileMutation.mutateAsync(formData);
      setIsEditingProfile(false);
      addToast({
        type: "success",
        title: t("profile.updateSuccess"),
        message: t("profile.updateSuccessMessage"),
      });
    } catch {
      addToast({
        type: "error",
        title: t("profile.updateError"),
        message: t("profile.updateErrorMessage"),
      });
    }
  };

  const handleProfileCancel = () => {
    setIsEditingProfile(false);
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
    });
  };

  const handleFilesUploaded = (fileKeys: string[]) => {
    setUploadedFiles(prev => [...prev, ...fileKeys]);
  };

  const handleFilesRemoved = (fileKeys: string[]) => {
    setUploadedFiles(prev => prev.filter(key => !fileKeys.includes(key)));
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast({
        type: "error",
        title: t("auth.validation.passwordsDoNotMatch"),
        message: t("auth.validation.passwordsDoNotMatch"),
      });
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      addToast({
        type: "success",
        title: t("profile.passwordChangeSuccess"),
        message: t("profile.passwordChangeSuccessMessage"),
      });
    } catch (error) {
      console.error("Password change error:", error);
      addToast({
        type: "error",
        title: t("profile.passwordChangeError"),
        message: t("profile.passwordChangeErrorMessage"),
      });
    }
  };

  const handlePasswordCancel = () => {
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {t("profile.notFound")}
            </h1>
            <p className="text-gray-600 mb-8">{t("profile.notFoundMessage")}</p>
            <Button onClick={() => router.push("/")}>{t("common.back")}</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("profile.title")}
          </h1>
          <p className="mt-2 text-gray-600">{t("profile.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                {t("profile.personalInfo")}
              </h2>
              {!isEditingProfile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleProfileEdit}
                  className="flex items-center"
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  {t("common.edit")}
                </Button>
              )}
            </div>

            {isEditingProfile ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("auth.register.firstName")}
                  </label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder={t("auth.register.firstNamePlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("auth.register.lastName")}
                  </label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder={t("auth.register.lastNamePlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("auth.register.phone")}
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder={t("auth.register.phonePlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Images
                  </label>
                  <FileUpload
                    onFilesUploaded={handleFilesUploaded}
                    onFilesRemoved={handleFilesRemoved}
                    uploadedFiles={uploadedFiles}
                    maxFiles={3}
                    accept="image/*"
                    folder="profile"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={handleProfileSave}
                    disabled={updateProfileMutation.isPending}
                    className="flex items-center"
                  >
                    <CheckIcon className="h-4 w-4 mr-1" />
                    {updateProfileMutation.isPending
                      ? t("common.loading")
                      : t("common.save")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleProfileCancel}
                    className="flex items-center"
                  >
                    <XMarkIcon className="h-4 w-4 mr-1" />
                    {t("common.cancel")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">
                      {t("auth.login.email")}
                    </p>
                    <p className="font-medium text-gray-900">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">
                      {t("auth.register.firstName")}
                    </p>
                    <p className="font-medium text-gray-900">
                      {user?.firstName || t("profile.notProvided")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">
                      {t("auth.register.lastName")}
                    </p>
                    <p className="font-medium text-gray-900">
                      {user?.lastName || t("profile.notProvided")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">
                      {t("auth.register.phone")}
                    </p>
                    <p className="font-medium text-gray-900">
                      {user?.phone || t("profile.notProvided")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">
                      {t("profile.memberSince")}
                    </p>
                    <p className="font-medium text-gray-900">
                      {user?.createdAt
                        ? new Date(user?.createdAt).toLocaleDateString()
                        : t("profile.notProvided")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Security Settings */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <KeyIcon className="h-5 w-5 mr-2" />
                {t("profile.security")}
              </h2>
              {!isChangingPassword && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsChangingPassword(true)}
                  className="flex items-center"
                >
                  <KeyIcon className="h-4 w-4 mr-1" />
                  {t("profile.changePassword")}
                </Button>
              )}
            </div>

            {isChangingPassword ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("profile.currentPassword")}
                  </label>
                  <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    placeholder={t("profile.currentPasswordPlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("auth.resetPassword.newPassword")}
                  </label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder={t("auth.resetPassword.newPasswordPlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("auth.resetPassword.confirmPassword")}
                  </label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder={t(
                      "auth.resetPassword.confirmPasswordPlaceholder"
                    )}
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={handlePasswordChange}
                    disabled={changePasswordMutation.isPending}
                    className="flex items-center"
                  >
                    <CheckIcon className="h-4 w-4 mr-1" />
                    {changePasswordMutation.isPending
                      ? t("common.loading")
                      : t("common.save")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handlePasswordCancel}
                    className="flex items-center"
                  >
                    <XMarkIcon className="h-4 w-4 mr-1" />
                    {t("common.cancel")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">
                    {t("profile.passwordSecurity")}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {t("profile.passwordSecurityDescription")}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">
                    {t("profile.accountStatus")}
                  </h3>
                  <p className="text-sm text-green-700">
                    {t("profile.accountActive")}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
