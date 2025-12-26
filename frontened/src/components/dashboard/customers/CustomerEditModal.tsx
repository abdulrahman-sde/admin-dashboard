import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Customer, CustomerDetail } from "@/types/customers.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
interface CustomerEditModalProps {
  customer: Customer | CustomerDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
import { useCustomerEdit } from "@/hooks/customers/useCustomerEdit";
import type { CustomerFormValues } from "@/schemas/customer.schema";
import type { FormFieldRenderProps } from "@/types/form.types";

export function CustomerEditModal({
  customer,
  open,
  onOpenChange,
}: CustomerEditModalProps) {
  const { form, onSubmit, isLoading } = useCustomerEdit({
    customer,
    onOpenChange,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField<CustomerFormValues, "firstName">
                control={form.control}
                name="firstName"
                render={({ field }: FormFieldRenderProps<string>) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField<CustomerFormValues, "lastName">
                control={form.control}
                name="lastName"
                render={({ field }: FormFieldRenderProps<string>) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField<CustomerFormValues, "email">
              control={form.control}
              name="email"
              render={({ field }: FormFieldRenderProps<string>) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField<CustomerFormValues, "phone">
                control={form.control}
                name="phone"
                render={({ field }: FormFieldRenderProps<string>) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField<CustomerFormValues, "status">
                control={form.control}
                name="status"
                render={({ field }: FormFieldRenderProps<string>) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="VIP">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField<CustomerFormValues, "notes">
              control={form.control}
              name="notes"
              render={({ field }: FormFieldRenderProps<string>) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
