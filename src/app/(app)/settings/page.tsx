import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockApiKeys } from "@/lib/data";
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-0">
        <div className="space-y-1 mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your API keys and workspace settings.
          </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                    Provide API keys for third-party services to enable more features. Keys are stored securely.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {mockApiKeys.map(apiKey => (
                    <div key={apiKey.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                                <KeyRound className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="font-medium">{apiKey.name}</p>
                                {apiKey.hasKey ? (
                                    <Badge variant="secondary" className="mt-1">Connected</Badge>
                                ) : (
                                    <Badge variant="outline" className="mt-1">Not Connected</Badge>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 max-w-sm">
                           <div className="relative">
                                <Input type="password" placeholder="Enter your API key" defaultValue={apiKey.hasKey ? "••••••••••••••••••••" : ""} />
                                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7">
                                    <Eye className="h-4 w-4" />
                                </Button>
                           </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    </div>
  );
}
