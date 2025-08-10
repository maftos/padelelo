import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useFormValidation } from "@/hooks/use-form-validation";
import { handleAuthError } from "@/utils/auth-error-handler";

const SecuritySettings = () => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { validatePassword } = useFormValidation();
  const isValidNew = validatePassword(newPassword);
  const passwordsMatch = newPassword === confirmPassword;

  const handlePasswordChange = async () => {
    if (!isValidNew) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (!passwordsMatch) {
      toast.error("New passwords don't match");
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      toast.success("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      const message = handleAuthError?.(error) ?? error?.message ?? "Failed to update password";
      toast.error(message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          Password
        </CardTitle>
        <CardDescription>
          Update your password and manage security settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <p className={`text-xs ${newPassword && !isValidNew ? 'text-destructive' : 'text-muted-foreground'}`}>
              Minimum 6 characters
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
            {confirmPassword && !passwordsMatch && (
              <p className="text-xs text-destructive">Passwords do not match</p>
            )}
          </div>
          <Button 
            onClick={handlePasswordChange}
            disabled={isChangingPassword || !isValidNew || !passwordsMatch}
            className="w-fit"
          >
            {isChangingPassword ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;