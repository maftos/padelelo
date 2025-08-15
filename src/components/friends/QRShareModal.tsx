import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { QrCode, Share2, Copy, Download } from "lucide-react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useIsMobile } from "@/hooks/use-mobile";

interface QRShareModalProps {
  children: React.ReactNode;
  userId?: string; // Optional userId, if not provided, uses current user
  profileName?: string; // Optional profile name for display
  profilePhoto?: string; // Optional profile photo for display
}

export const QRShareModal = ({ children, userId, profileName, profilePhoto }: QRShareModalProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { profile } = useUserProfile();
  const isMobile = useIsMobile();

  // Use provided userId or fall back to current user's profile
  const targetUserId = userId || profile?.id;
  const profileUrl = `https://padelelo.com/profile/${targetUserId}`;
  const displayName = profileName || (profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}` 
    : "Profile");
  const avatarUrl = profilePhoto || profile?.profile_photo;

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const ModalContent = () => (
    <div className="space-y-6">
      {/* User Profile Section */}
      <div className="flex items-center justify-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-base">{displayName}</h3>
        </div>
      </div>

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

      {/* Action Button */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={copyToClipboard} className="w-full max-w-xs">
          <Copy className="w-4 h-4 mr-2" />
          Copy Link
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild onClick={generateQRCode}>
          {children}
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-center">
              Share Your Profile
            </DrawerTitle>
            <DrawerDescription className="text-center">
              Other players can scan this to add you as a friend
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <ModalContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild onClick={generateQRCode}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Share Your Profile
          </DialogTitle>
          <DialogDescription className="text-center">
            Other players can scan this to add you as a friend
          </DialogDescription>
        </DialogHeader>
        
        <ModalContent />
      </DialogContent>
    </Dialog>
  );
};