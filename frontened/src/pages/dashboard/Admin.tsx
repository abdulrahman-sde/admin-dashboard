import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Edit,
  Share2,
  Copy,
  PlusCircle,
  EyeOff,
  Eye,
  Calendar,
  Pencil,
  Wand2,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  biography: z.string().optional(),
  avatar: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export default function Admin() {
  const { user, updateProfile, changePassword } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      biography: user?.biography || "",
      avatar: user?.avatar || "",
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
      });
    }
  }, [user, profileForm]);

  const onProfileSubmit = async (data: ProfileValues) => {
    try {
      setIsUpdatingProfile(true);
      await updateProfile(data);
      toast.success("Profile updated successfully", {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      });
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

  // Fallbacks if user data is missing
  const firstName = user?.firstName || "Admin";
  const lastName = user?.lastName || "User";
  const fullName = `${firstName} ${lastName}`;
  const email = user?.email || "admin@example.com";
  const profileImage = user?.avatar || "https://github.com/shadcn.png";
  const initials = `${firstName[0] || ""}${lastName[0] || ""}`;

  return (
    <div className="p-6 font-inter max-w-[1600px] mx-auto">
      <h1 className="text-2xl font-bold text-[#151D48] mb-6">About section</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <Card className="border-none shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold text-[#151D48]">
                Profile
              </CardTitle>
              <div className="flex gap-2 text-gray-400">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:text-primary"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:text-primary"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="mb-4 relative">
                <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
                  <AvatarImage src={profileImage} alt={fullName} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </div>
              <h2 className="text-lg font-bold text-[#151D48]">{fullName}</h2>
              <div className="flex items-center gap-2 text-sm text-[#737791] mt-1 mb-6">
                <span>{email}</span>
                <Copy
                  className="h-3 w-3 cursor-pointer hover:text-primary"
                  onClick={copyEmail}
                />
              </div>

              <div className="w-full">
                <p className="text-sm font-medium text-[#151D48] text-center mb-4">
                  Linked with Social media
                </p>
                <div className="flex justify-center gap-4 mb-6">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 border-none shadow-none bg-transparent hover:bg-gray-50"
                  >
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="h-5 w-5"
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 border-none shadow-none bg-transparent hover:bg-gray-50"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg"
                      alt="Facebook"
                      className="h-5 w-5"
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 border-none shadow-none bg-transparent hover:bg-gray-50"
                  >
                    <X className="h-5 w-5 text-black" />
                  </Button>
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    className="gap-2 text-[#737791] border-gray-200"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Social media
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card className="border-none shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-bold text-[#151D48]">
                Change Password
              </CardTitle>
              <a href="#" className="text-xs text-blue-500 hover:underline">
                Need help ?
              </a>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-[#151D48]">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      {...passwordForm.register("currentPassword")}
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className="pr-10 bg-[#F9FAFB] border-gray-200"
                    />
                    <button
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      type="button"
                    >
                      {showCurrentPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-xs text-destructive">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                  <div className="text-xs">
                    <a href="#" className="text-blue-500 hover:underline">
                      Forgot Current Password? Click here
                    </a>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-[#151D48]">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      {...passwordForm.register("newPassword")}
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className="pr-10 bg-[#F9FAFB] border-gray-200"
                    />
                    <button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      type="button"
                    >
                      {showNewPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-xs text-destructive">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-[#151D48]">
                    Re-enter Password
                  </Label>
                  <div className="relative">
                    <Input
                      {...passwordForm.register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className="pr-10 bg-[#F9FAFB] border-gray-200"
                    />
                    <button
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      type="button"
                    >
                      {showConfirmPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-destructive">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full bg-[#48A878] hover:bg-[#3d9165] text-white mt-4 h-11"
                >
                  {isChangingPassword ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Save Change
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Profile Update */}
        <div className="lg:col-span-8">
          <Card className="border-none shadow-sm rounded-xl h-full">
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b border-gray-50">
                <CardTitle className="text-lg font-bold text-[#151D48]">
                  Profile Update
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="gap-2 bg-[#48A878] hover:bg-[#3d9165] text-white"
                  >
                    {isUpdatingProfile ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={profileForm.watch("avatar") || profileImage}
                      alt={fullName}
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Button
                        type="button"
                        className="bg-[#48A878] hover:bg-[#3d9165] text-white h-9 px-4"
                        onClick={() => {
                          const url = prompt("Enter Image URL");
                          if (url !== null) profileForm.setValue("avatar", url);
                        }}
                      >
                        Upload New
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 px-4 text-[#737791] border-gray-200 bg-white"
                      onClick={() => profileForm.setValue("avatar", "")}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#737791]">
                      First Name
                    </Label>
                    <Input
                      {...profileForm.register("firstName")}
                      className="bg-[#F9FAFB] border-gray-200 font-semibold text-[#151D48]"
                    />
                    {profileForm.formState.errors.firstName && (
                      <p className="text-xs text-destructive">
                        {profileForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#737791]">
                      Last Name
                    </Label>
                    <Input
                      {...profileForm.register("lastName")}
                      className="bg-[#F9FAFB] border-gray-200 font-semibold text-[#151D48]"
                    />
                    {profileForm.formState.errors.lastName && (
                      <p className="text-xs text-destructive">
                        {profileForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#737791]">
                      Status
                    </Label>
                    <Input
                      value={user?.status || "ACTIVE"}
                      readOnly
                      className="bg-[#F9FAFB] border-gray-100/50 font-semibold text-[#151D48] opacity-70 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#737791]">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Input
                        {...profileForm.register("phone")}
                        placeholder="No phone added"
                        className="bg-[#F9FAFB] border-gray-200 font-semibold text-[#151D48] pr-16"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <img
                          src="https://flagcdn.com/w20/us.png"
                          alt="US"
                          className="w-5 h-auto rounded-sm"
                        />
                        <span className="text-[10px] text-gray-400">▼</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#737791]">
                      E-mail
                    </Label>
                    <Input
                      {...profileForm.register("email")}
                      className="bg-[#F9FAFB] border-gray-200 font-semibold text-[#151D48]"
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-xs text-destructive">
                        {profileForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#737791]">
                      Member Since
                    </Label>
                    <div className="relative">
                      <Input
                        value={
                          user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : ""
                        }
                        className="bg-[#F9FAFB] border-gray-100/50 font-semibold text-[#151D48] pl-3 pr-10 opacity-70 cursor-not-allowed"
                        readOnly
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#737791]">
                    Role
                  </Label>
                  <Input
                    value={user?.role || "ADMIN"}
                    readOnly
                    className="bg-[#F9FAFB] border-gray-100/50 font-semibold text-[#151D48] opacity-70 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#737791]">
                    Last Login
                  </Label>
                  <Input
                    value={
                      user?.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleString()
                        : "Never"
                    }
                    readOnly
                    className="bg-[#F9FAFB] border-gray-100/50 font-semibold text-[#151D48] opacity-70 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#737791]">
                    Biography
                  </Label>
                  <div className="relative">
                    <Textarea
                      {...profileForm.register("biography")}
                      placeholder="Enter a biography about you"
                      className="bg-[#F9FAFB] border-gray-200 min-h-[120px] resize-none pr-10"
                    />
                    <div className="absolute right-3 bottom-3 flex gap-2 text-gray-400">
                      <Pencil className="h-4 w-4" />
                      <Wand2 className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
