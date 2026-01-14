import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit,
  Eye,
  EyeOff,
  Calendar,
  Wand2,
  Loader2,
  CheckCircle2,
  ChevronDown,
  Copy,
  Plus,
  Share2,
} from "lucide-react";
import { useAdminProfile } from "@/hooks/dashboard/useAdminProfile";
import googleIcon from "@/assets/icons/google.png";
import facebookIcon from "@/assets/icons/facebook.png";

export default function Admin() {
  const {
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
  } = useAdminProfile();

  const firstName = user?.firstName || "Admin";
  const lastName = user?.lastName || "User";
  const initials = `${firstName[0] || ""}${lastName[0] || ""}`;
  const profileImage = user?.avatar || "https://github.com/shadcn.png";
  const fullName = `${firstName} ${lastName}`;
  const email = user?.email || "admin@example.com";

  return (
    <div className="bg-[#F8F9FB] min-h-screen overflow-x-hidden font-sans">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-[#151D48]">
          About section
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-[12px] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[#151D48] text-[20px]">
                Profile
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled
                  className="h-8 w-8 p-0 text-gray-400 hover:text-[#48A878] disabled:opacity-50"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled
                  className="h-8 w-8 p-0 text-gray-400 hover:text-[#48A878] disabled:opacity-50"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="h-32 w-32 border-4 border-white shadow-sm">
                  <AvatarImage src={profileImage} alt="Profile" />
                  <AvatarFallback className="text-3xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              <h2 className="text-xl font-bold text-[#151D48] mb-1">
                {fullName}
              </h2>
              <div className="flex items-center gap-2 text-[#737791] mb-6">
                <span className="text-sm">{email}</span>
                <Copy
                  className="h-4 w-4 cursor-pointer text-gray-400 hover:text-[#48A878]"
                  onClick={copyEmail}
                />
              </div>

              <h4 className="text-[#151D48] font-medium text-sm mb-3">
                Linked with Social media
              </h4>
              <div className="flex gap-4 mb-6">
                <div className="flex items-center gap-1 text-[#4285F4] font-medium text-sm">
                  <img src={googleIcon} alt="Google" className="w-5 h-5" />
                  <span className="text-xs">Linked</span>
                </div>
                <div className="flex items-center gap-1 text-[#1877F2] font-medium text-sm">
                  <img src={facebookIcon} alt="Facebook" className="w-5 h-5" />
                  <span className="text-xs">Linked</span>
                </div>
                <div className="flex items-center gap-1 text-black font-medium text-sm">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="text-xs">Linked</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="gap-2 text-[#737791] border-gray-200 w-full rounded-[12px] h-11"
              >
                <Plus className="h-5 w-5" />
                Social media
              </Button>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-[12px] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#151D48]">
                Change Password
              </h3>
              <a
                href="#"
                className="text-[#4285F4] text-sm flex items-center gap-1 hover:underline"
              >
                Need help{" "}
                <span className="inline-flex items-center justify-center rounded-full border-2 border-[#4285F4] w-5 h-5 text-xs font-medium">
                  ?
                </span>
              </a>
            </div>

            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label className="text-[#151D48] font-medium text-sm">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    {...passwordForm.register("currentPassword")}
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="bg-transparent border-gray-200 h-12 pr-10 rounded-[12px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#48A878]"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-xs text-destructive mt-1">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <a href="#" className="text-[#4285F4] text-sm block">
                Forgot Current Password? Click here
              </a>

              <div className="space-y-2">
                <Label className="text-[#151D48] font-medium text-sm">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    {...passwordForm.register("newPassword")}
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="bg-transparent border-gray-200 h-12 pr-10 rounded-[12px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#48A878]"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-xs text-destructive mt-1">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[#151D48] font-medium text-sm">
                  Re-enter Password
                </Label>
                <div className="relative">
                  <Input
                    {...passwordForm.register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="bg-transparent border-gray-200 h-12 pr-10 rounded-[12px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#48A878]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-destructive mt-1">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#48A878] hover:bg-[#3d9165] text-white h-12 mt-4 rounded-[12px]"
                disabled={isChangingPassword}
              >
                {isChangingPassword ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Save Change
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[12px] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[20px] font-semibold text-[#151D48]">
                Profile Update
              </h3>
              {!isEditMode ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditMode(true)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-[#48A878]"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditMode(false);
                      profileForm.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={profileForm.handleSubmit(onProfileSubmit)}
                    disabled={isUpdatingProfile || !hasChanges}
                    className="bg-[#48A878] hover:bg-[#3d9165] text-white"
                  >
                    {isUpdatingProfile ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    )}
                    Save
                  </Button>
                </div>
              )}
            </div>

            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
              <div className="flex flex-col space-y-6">
                {/* Profile Image Section */}
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-sm">
                    <AvatarImage src={profileImage} alt="Profile" />
                    <AvatarFallback className="text-2xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="bg-[#48A878] hover:bg-[#3d9165] text-white h-10 px-4 rounded-[12px]"
                    >
                      {isUploadingImage ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Upload New
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 px-4 rounded-[12px] border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Delete
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                  {/* Row 1 - Names */}
                  <div className="space-y-2">
                    <Label className="text-[14px] font-medium text-[#151D48]">
                      First Name
                    </Label>
                    <div className="h-[48px]">
                      <Input
                        {...profileForm.register("firstName")}
                        className="h-full bg-[#F9FAFB] border-gray-200 focus-visible:ring-[#48A878] text-[14px] font-medium text-[#151D48] rounded-[12px]"
                        readOnly={!isEditMode}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[14px] font-medium text-[#151D48]">
                      Last Name
                    </Label>
                    <div className="h-[48px]">
                      <Input
                        {...profileForm.register("lastName")}
                        className="h-full bg-[#F9FAFB] border-gray-200 focus-visible:ring-[#48A878] text-[14px] font-medium text-[#151D48] rounded-[12px]"
                        readOnly={!isEditMode}
                      />
                    </div>
                  </div>

                  {/* Row 2 - Password & Phone */}
                  <div className="space-y-2">
                    <Label className="text-[14px] font-medium text-[#151D48]">
                      Password
                    </Label>
                    <div className="relative h-[48px]">
                      <Input
                        type="password"
                        value="••••••••••"
                        className="h-full bg-[#F9FAFB] border-gray-200 focus-visible:ring-[#48A878] text-[14px] font-medium text-[#151D48] pr-10 rounded-[12px]"
                        disabled
                      />
                      <button
                        type="button"
                        disabled
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 disabled:opacity-50"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[14px] font-medium text-[#151D48]">
                      Phone Number
                    </Label>
                    <div className="relative h-[48px]">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-200 pr-3 pointer-events-none z-10">
                        <span className="text-lg">🇺🇸</span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input
                        {...profileForm.register("phone")}
                        className="h-full bg-[#F9FAFB] border-gray-200 focus-visible:ring-[#48A878] text-[14px] font-medium text-[#151D48] pl-[76px] rounded-[12px]"
                        placeholder="(406) 555-0120"
                        readOnly={!isEditMode}
                      />
                    </div>
                  </div>

                  {/* Row 3 - Email & Date of Birth */}
                  <div className="space-y-2">
                    <Label className="text-[14px] font-medium text-[#151D48]">
                      E-mail
                    </Label>
                    <div className="h-[48px]">
                      <Input
                        {...profileForm.register("email")}
                        className="h-full bg-[#F9FAFB] border-gray-200 focus-visible:ring-[#48A878] text-[14px] font-medium text-[#151D48] rounded-[12px]"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[14px] font-medium text-[#151D48]">
                      Date of Birth
                    </Label>
                    <div className="relative h-[48px]">
                      <Input
                        {...profileForm.register("dateOfBirth")}
                        className="h-full bg-[#F9FAFB] border-gray-200 focus-visible:ring-[#48A878] text-[14px] font-medium text-[#151D48] pr-10 rounded-[12px]"
                        readOnly={!isEditMode}
                        type="date"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Location - Full width */}
                <div className="space-y-2">
                  <Label className="text-[14px] font-medium text-[#151D48]">
                    Location
                  </Label>
                  <div className="h-[48px]">
                    <Input
                      {...profileForm.register("location")}
                      className="h-full bg-[#F9FAFB] border-gray-200 focus-visible:ring-[#48A878] text-[14px] font-medium text-[#151D48] rounded-[12px]"
                      readOnly={!isEditMode}
                    />
                  </div>
                </div>

                {/* Credit Card - Full width */}
                <div className="space-y-2">
                  <Label className="text-[14px] font-medium text-[#151D48]">
                    Credit Card
                  </Label>
                  <div className="relative h-[48px]">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10">
                      <div className="flex -space-x-2">
                        <div className="w-5 h-5 rounded-full bg-[#EB001B] opacity-80" />
                        <div className="w-5 h-5 rounded-full bg-[#F79E1B] opacity-80" />
                      </div>
                    </div>
                    <Input
                      {...profileForm.register("creditCard")}
                      className="h-full bg-[#F9FAFB] border-gray-200 focus-visible:ring-[#48A878] text-[14px] font-medium text-[#151D48] pl-12 pr-10 rounded-[12px]"
                      placeholder="843-4359-4444"
                      readOnly={!isEditMode}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Biography - Full width */}
                <div className="space-y-2">
                  <Label className="text-[14px] font-medium text-[#151D48]">
                    Biography
                  </Label>
                  <div className="relative">
                    <Textarea
                      {...profileForm.register("biography")}
                      placeholder="Enter a biography about you"
                      className="min-h-[120px] resize-none pr-10 border-gray-200 focus-visible:ring-[#48A878] text-[14px] font-medium text-[#151D48] bg-[#F9FAFB] border-0 rounded-[12px]"
                      readOnly={!isEditMode}
                    />
                    <div className="absolute right-3 bottom-3 flex gap-2 text-gray-400">
                      <button
                        type="button"
                        onClick={() => setIsEditMode(true)}
                        disabled={isEditMode}
                        className="hover:text-[#48A878] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleRefineBiography}
                        disabled={isRefiningBio || !isEditMode}
                        className="hover:text-[#48A878] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isRefiningBio ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Wand2 className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
