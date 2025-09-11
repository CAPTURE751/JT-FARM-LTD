
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationCenter } from "@/components/NotificationCenter";
import { FARM_BRANDING } from "@/lib/constants";

export function Header() {
  return (
    <header className="h-16 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden" />
        <div className="hidden sm:block">
          <h1 className="text-xl font-semibold text-farm-green">{FARM_BRANDING.name}</h1>
          <p className="text-xs text-muted-foreground">{FARM_BRANDING.location}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <NotificationCenter />
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
