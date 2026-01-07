import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit,
  Share2,
  Copy,
  EyeOff,
  Eye,
  Calendar,
  Wand2,
  Loader2,
  CheckCircle2,
  Upload,
} from "lucide-react";
import { useAdminProfile } from "@/hooks/dashboard/useAdminProfile";

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
  const fullName = `${firstName} ${lastName}`;
  const email = user?.email || "admin@example.com";
  const profileImage = user?.avatar || "https://github.com/shadcn.png";
  const initials = `${firstName[0] || ""}${lastName[0] || ""}`;

  return (
    <div className="bg-[#F8F9FB] -m-4 sm:-m-6 p-4 sm:p-10 space-y-[22px] min-h-screen overflow-x-hidden">
      <h1 className="text-2xl font-bold text-[#151D48]">About section</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[22px]">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-[22px]">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex flex-row items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#151D48]">Profile</h3>
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
            </div>
            <div className="flex flex-col items-center">
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
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex flex-row items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#151D48]">
                Change Password
              </h3>
            </div>
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
                    className="pr-10"
                  />
                  <button
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
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
                    className="pr-10"
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
                    className="pr-10"
                  />
                  <button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
          </div>
        </div>

        {/* Right Column - Profile Update */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl p-6">
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
              <div className="flex flex-row items-center justify-between mb-6 pb-6 border-b border-gray-50">
                <h3 className="text-lg font-bold text-[#151D48]">
                  Profile Update
                </h3>
                <div className="flex gap-2">
                  {isEditMode && (
                    <>
                      <Button
                        type="button"
                        onClick={() => {
                          setIsEditMode(false);
                          profileForm.reset();
                        }}
                        variant="outline"
                        className="gap-2 border-gray-200"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isUpdatingProfile || !hasChanges}
                        className="gap-2 bg-[#48A878] hover:bg-[#3d9165] text-white disabled:opacity-50"
                      >
                        {isUpdatingProfile ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        Update
                      </Button>
                    </>
                  )}
                  {!isEditMode && (
                    <Button
                      type="button"
                      onClick={() => setIsEditMode(true)}
                      variant="outline"
                      className="gap-2 border-gray-200"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={profileForm.watch("avatar") || profileImage}
                      alt={fullName}
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      className="bg-[#48A878] hover:bg-[#3d9165] text-white h-9 px-4"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage || !isEditMode}
                    >
                      {isUploadingImage ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Upload New
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 px-4 text-[#737791] border-gray-200 bg-white"
                      onClick={() =>
                        profileForm.setValue("avatar", "", {
                          shouldDirty: true,
                        })
                      }
                      disabled={!isEditMode}
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
                      className="font-semibold text-[#151D48]"
                      readOnly={!isEditMode}
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
                      className="font-semibold text-[#151D48]"
                      readOnly={!isEditMode}
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
                      className="font-semibold text-[#151D48] opacity-70 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#737791]">
                      Phone Number
                    </Label>
                    <Input
                      {...profileForm.register("phone")}
                      placeholder="No phone added"
                      className="font-semibold text-[#151D48]"
                      readOnly={!isEditMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#737791]">
                      E-mail
                    </Label>
                    <Input
                      {...profileForm.register("email")}
                      className="font-semibold text-[#151D48]"
                      readOnly
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
                            ? new Date(user.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )
                            : ""
                        }
                        className="font-semibold text-[#151D48] pl-3 pr-10 opacity-70 cursor-not-allowed"
                        readOnly
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#737791]">
                    Location
                  </Label>
                  <Input
                    {...profileForm.register("location")}
                    placeholder="2972 Westheimer Rd. Santa Ana, Illinois 85486"
                    className="font-semibold text-[#151D48]"
                    readOnly={!isEditMode}
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
                      className="min-h-[120px] resize-none pr-10"
                      readOnly={!isEditMode}
                    />
                    <div className="absolute right-3 bottom-3 flex gap-2 text-gray-400">
                      <button
                        type="button"
                        onClick={handleRefineBiography}
                        disabled={isRefiningBio || !isEditMode}
                        className="hover:text-[#48A878] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isRefiningBio ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Click the magic wand to refine your biography with AI
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
