import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Share2, Copy, Download } from "lucide-react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/use-user-profile";

interface QRShareModalProps {
  children: React.ReactNode;
  userId?: string; // Optional userId, if not provided, uses current user
  profileName?: string; // Optional profile name for display
}

export const QRShareModal = ({ children, userId, profileName }: QRShareModalProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { profile } = useUserProfile();

  // Use provided userId or fall back to current user's profile
  const targetUserId = userId || profile?.id;
  const profileUrl = `https://padelelo.com/profile/${targetUserId}`;
  const displayName = profileName || (profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}` 
    : "Profile");

  const generateQRCode = async () => {
    if (qrCodeUrl) return; // Already generated
    
    setIsGenerating(true);
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error("Failed to generate QR code");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Profile link copied to clipboard!");
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error("Failed to copy link");
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.download = `${displayName.replace(/\s+/g, '_')}_profile_qr.png`;
    link.href = qrCodeUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR code downloaded!");
  };

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayName} - PadelELO Profile`,
          text: `Check out my padel profile on PadelELO!`,
          url: profileUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to copy
        copyToClipboard();
      }
    } else {
      // Fallback to copy
      copyToClipboard();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild onClick={generateQRCode}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Share Your Profile
          </DialogTitle>
          <DialogDescription>
            Share your PadelELO profile with other players to connect easily
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* QR Code */}
          <div className="flex justify-center">
            {isGenerating ? (
              <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center animate-pulse">
                <QrCode className="w-12 h-12 text-muted-foreground" />
              </div>
            ) : qrCodeUrl ? (
              <div className="p-4 bg-white rounded-lg shadow-sm border">
                <img src={qrCodeUrl} alt="Profile QR Code" className="w-56 h-56" />
              </div>
            ) : (
              <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
                <QrCode className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="text-center space-y-2">
            <h3 className="font-semibold">{displayName}</h3>
            <p className="text-sm text-muted-foreground break-all">{profileUrl}</p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={copyToClipboard} className="w-full">
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button variant="outline" onClick={shareProfile} className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            {qrCodeUrl && (
              <>
                <Button variant="outline" onClick={downloadQRCode} className="w-full col-span-2">
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
              </>
            )}
          </div>

          {/* Instructions */}
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>Other players can scan this QR code to visit your profile</p>
            <p>or use the link to add you as a friend</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};