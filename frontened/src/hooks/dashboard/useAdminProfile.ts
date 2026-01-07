import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { profileSchema, passwordSchema } from "@/types/admin.types";
import type { ProfileValues, PasswordValues } from "@/types/admin.types";

export const useAdminProfile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isRefiningBio, setIsRefiningBio] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      biography: user?.biography || "",
      avatar: user?.avatar || "",
      location: user?.location || "",
    },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        biography: user.biography || "",
        avatar: user.avatar || "",
        location: user.location || "",
      });
    }
  }, [user, profileForm]);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "socialApp");
    formData.append("cloud_name", "deni18m0m");
    formData.append("folder", "admin-profiles");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/deni18m0m/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      throw error;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setIsUploadingImage(true);
      const imageUrl = await uploadToCloudinary(file);
      profileForm.setValue("avatar", imageUrl, { shouldDirty: true });
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRefineBiography = async () => {
    const currentBio = profileForm.getValues("biography");
    if (!currentBio || currentBio.length < 10) {
      toast.error("Please enter at least 10 characters to refine");
      return;
    }

    try {
      setIsRefiningBio(true);
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:4000/api/admin";
      const response = await fetch(`${API_BASE_URL}/ai/refine-biography`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ biography: currentBio }),
      });

      if (!response.ok) {
        throw new Error("Failed to refine biography");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let refinedBio = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          refinedBio += chunk;
          profileForm.setValue("biography", refinedBio, { shouldDirty: true });
        }
      }

      toast.success("Biography refined successfully");
    } catch (error: any) {
      console.error("Biography refinement error:", error);
      toast.error(
        error?.message || "Failed to refine biography. Please try again."
      );
    } finally {
      setIsRefiningBio(false);
    }
  };

  const onProfileSubmit = async (data: ProfileValues) => {
    try {
      setIsUpdatingProfile(true);
      await updateProfile(data);
      toast.success("Profile updated successfully");
      setIsEditMode(false);
      profileForm.reset(data);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordValues) => {
    try {
      setIsChangingPassword(true);
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success("Password changed successfully");
      passwordForm.reset();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const copyEmail = () => {
    if (user?.email) {
      navigator.clipboard.writeText(user.email);
      toast.info("Email copied to clipboard");
    }
  };

  const hasChanges = profileForm.formState.isDirty;

  return {
    user,
    profileForm,
    passwordForm,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isUpdatingProfile,
    isChangingPassword,
    isUploadingImage,
    isRefiningBio,
    isEditMode,
    setIsEditMode,
    fileInputRef,
    handleImageUpload,
    handleRefineBiography,
    onProfileSubmit,
    onPasswordSubmit,
    copyEmail,
    hasChanges,
  };
};
