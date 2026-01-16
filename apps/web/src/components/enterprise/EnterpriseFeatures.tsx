"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Palette,
  Building2,
  Users,
  CreditCard,
  BarChart3,
  Shield,
  Globe,
  Upload,
  Download,
  Eye,
  Save,
  RefreshCw,
} from "lucide-react";
import { Button } from "@omnipdf/ui/src/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@omnipdf/ui/src/Card";
import { Input } from "@omnipdf/ui/src/Input";
import { cn } from "@omnipdf/shared/src/utils";

export interface BrandConfig {
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  companyName: string;
  customDomain: string;
  favicon: string | null;
}

export interface UsageMetrics {
  conversionsThisMonth: number;
  storageUsed: number;
  apiCalls: number;
  teamMembers: number;
  billingCycleStart: string;
  billingCycleEnd: string;
  planLimit: {
    conversions: number;
    storage: number;
    apiCalls: number;
    teamMembers: number;
  };
}

export interface EnterpriseBrandingProps {
  onSave: (config: BrandConfig) => void;
  initialConfig?: Partial<BrandConfig>;
  className?: string;
}

export function EnterpriseBranding({
  onSave,
  initialConfig,
  className,
}: EnterpriseBrandingProps) {
  const [config, setConfig] = useState<BrandConfig>({
    logo: initialConfig?.logo || null,
    primaryColor: initialConfig?.primaryColor || "#2563eb",
    secondaryColor: initialConfig?.secondaryColor || "#1e40af",
    fontFamily: initialConfig?.fontFamily || "Inter",
    companyName: initialConfig?.companyName || "",
    customDomain: initialConfig?.customDomain || "",
    favicon: initialConfig?.favicon || null,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/logo", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setConfig({ ...config, logo: data.url });
      }
    } catch (error) {
      console.error("Logo upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(config);
    } finally {
      setSaving(false);
    }
  };

  const previewStyles = {
    "--brand-primary": config.primaryColor,
    "--brand-secondary": config.secondaryColor,
    "--font-family": config.fontFamily,
  } as React.CSSProperties;

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Custom Branding
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Company Name
              </label>
              <Input
                value={config.companyName}
                onChange={(e) =>
                  setConfig({ ...config, companyName: e.target.value })
                }
                placeholder="Your Company Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Custom Domain
              </label>
              <Input
                value={config.customDomain}
                onChange={(e) =>
                  setConfig({ ...config, customDomain: e.target.value })
                }
                placeholder="pdf.yourcompany.com"
              />
              <p className="text-xs text-surface-500 mt-1">
                Point your domain to our servers to use your own URL
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) =>
                      setConfig({ ...config, primaryColor: e.target.value })
                    }
                    className="h-10 w-16 rounded border border-surface-300"
                  />
                  <Input
                    value={config.primaryColor}
                    onChange={(e) =>
                      setConfig({ ...config, primaryColor: e.target.value })
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) =>
                      setConfig({ ...config, secondaryColor: e.target.value })
                    }
                    className="h-10 w-16 rounded border border-surface-300"
                  />
                  <Input
                    value={config.secondaryColor}
                    onChange={(e) =>
                      setConfig({ ...config, secondaryColor: e.target.value })
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Font Family
              </label>
              <select
                value={config.fontFamily}
                onChange={(e) =>
                  setConfig({ ...config, fontFamily: e.target.value })
                }
                className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm dark:border-surface-600 dark:bg-surface-800"
              >
                <option value="Inter">Inter (Default)</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Poppins">Poppins</option>
                <option value="Raleway">Raleway</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Logo
              </label>
              <div className="flex items-center gap-4">
                {config.logo ? (
                  <img
                    src={config.logo}
                    alt="Company Logo"
                    className="h-16 w-auto rounded-lg border border-surface-200"
                  />
                ) : (
                  <div className="h-16 w-32 rounded-lg border-2 border-dashed border-surface-300 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-surface-400" />
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload">
                    <Button variant="secondary" size="sm" component="span">
                      {uploading ? "Uploading..." : "Upload Logo"}
                    </Button>
                  </label>
                  <p className="text-xs text-surface-500 mt-1">
                    Recommended: 200x50px, PNG or SVG
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Favicon
              </label>
              <div className="flex items-center gap-4">
                {config.favicon ? (
                  <img
                    src={config.favicon}
                    alt="Favicon"
                    className="h-8 w-8 rounded"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-lg border border-surface-300" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setConfig({
                          ...config,
                          favicon: reader.result as string,
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                  id="favicon-upload"
                />
                <label htmlFor="favicon-upload">
                  <Button variant="secondary" size="sm" component="span">
                    Upload Favicon
                  </Button>
                </label>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-surface-200 bg-surface-50 dark:bg-surface-800 dark:border-surface-700">
              <h4 className="text-sm font-medium text-surface-900 dark:text-white mb-3">
                Preview
              </h4>
              <div
                className="rounded-lg p-4 bg-white dark:bg-surface-900"
                style={previewStyles}
              >
                <div className="flex items-center gap-2 mb-3">
                  {config.logo ? (
                    <img src={config.logo} alt="Logo" className="h-6" />
                  ) : (
                    <span
                      className="font-bold text-lg"
                      style={{ color: config.primaryColor }}
                    >
                      {config.companyName || "Your Company"}
                    </span>
                  )}
                </div>
                <div
                  className="h-2 rounded-full mb-2"
                  style={{ backgroundColor: config.primaryColor, width: "60%" }}
                />
                <div
                  className="h-2 rounded-full"
                  style={{
                    backgroundColor: config.secondaryColor,
                    width: "40%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-surface-200 dark:border-surface-700">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving}
            leftIcon={
              saving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )
            }
          >
            {saving ? "Saving..." : "Save Branding"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function UsageReporting({
  metrics,
  className,
}: {
  metrics: UsageMetrics;
  className?: string;
}) {
  const usagePercentages = {
    conversions: Math.round(
      (metrics.conversionsThisMonth / metrics.planLimit.conversions) * 100,
    ),
    storage: Math.round(
      (metrics.storageUsed / metrics.planLimit.storage) * 100,
    ),
    apiCalls: Math.round((metrics.apiCalls / metrics.planLimit.apiCalls) * 100),
    teamMembers: Math.round(
      (metrics.teamMembers / metrics.planLimit.teamMembers) * 100,
    ),
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Usage & Reporting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <UsageCard
            title="Conversions"
            current={metrics.conversionsThisMonth}
            limit={metrics.planLimit.conversions}
            percentage={usagePercentages.conversions}
          />
          <UsageCard
            title="Storage"
            current={formatBytes(metrics.storageUsed)}
            limit={formatBytes(metrics.planLimit.storage)}
            percentage={usagePercentages.storage}
          />
          <UsageCard
            title="API Calls"
            current={metrics.apiCalls.toLocaleString()}
            limit={metrics.planLimit.apiCalls.toLocaleString()}
            percentage={usagePercentages.apiCalls}
          />
          <UsageCard
            title="Team Members"
            current={metrics.teamMembers}
            limit={metrics.planLimit.teamMembers}
            percentage={usagePercentages.teamMembers}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-surface-50 dark:bg-surface-800">
          <div className="text-sm">
            <span className="text-surface-600 dark:text-surface-400">
              Billing Cycle:{" "}
            </span>
            <span className="font-medium text-surface-900 dark:text-white">
              {new Date(metrics.billingCycleStart).toLocaleDateString()} -{" "}
              {new Date(metrics.billingCycleEnd).toLocaleDateString()}
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export Report
          </Button>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-surface-900 dark:text-white">
            Usage History
          </h4>
          <div className="h-32 flex items-end gap-1">
            {[65, 78, 45, 89, 72, 95, 88, 76, 92, 85, 98, 82].map(
              (value, index) => (
                <div
                  key={index}
                  className="flex-1 bg-primary-200 dark:bg-primary-800 rounded-t"
                  style={{ height: `${value}%` }}
                />
              ),
            )}
          </div>
          <div className="flex justify-between text-xs text-surface-500">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UsageCard({
  title,
  current,
  limit,
  percentage,
}: {
  title: string;
  current: string | number;
  limit: string | number;
  percentage: number;
}) {
  return (
    <div className="p-4 rounded-lg border border-surface-200 dark:border-surface-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-surface-600 dark:text-surface-400">
          {title}
        </span>
        <span className="text-xs text-surface-500">{percentage}%</span>
      </div>
      <div className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
        {current}
      </div>
      <div className="text-xs text-surface-500">of {limit}</div>
      <div className="h-1.5 rounded-full bg-surface-200 dark:bg-surface-700 mt-2 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            percentage >= 90
              ? "bg-red-500"
              : percentage >= 75
                ? "bg-yellow-500"
                : "bg-green-500",
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

export function BillingManagement({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  const handleUpdatePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/billing/portal", { method: "POST" });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Billing Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-lg border border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-surface-900 dark:text-white">
                Enterprise Plan
              </h4>
              <p className="text-sm text-surface-500">
                $24.99/month • Billed monthly
              </p>
            </div>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Active
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-surface-900 dark:text-white">
            Payment Method
          </h4>
          <div className="flex items-center justify-between p-4 rounded-lg border border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-3">
              <div className="h-8 w-12 rounded bg-gradient-to-r from-blue-600 to-blue-800" />
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-white">
                  •••• •••• •••• 4242
                </p>
                <p className="text-xs text-surface-500">Expires 12/26</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpdatePayment}
              disabled={loading}
            >
              {loading ? "Loading..." : "Update"}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-surface-900 dark:text-white">
            Billing History
          </h4>
          <div className="divide-y divide-surface-200 dark:divide-surface-700">
            {[
              { date: "Jan 1, 2026", amount: "$24.99", status: "Paid" },
              { date: "Dec 1, 2025", amount: "$24.99", status: "Paid" },
              { date: "Nov 1, 2025", amount: "$24.99", status: "Paid" },
            ].map((invoice, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="text-sm text-surface-900 dark:text-white">
                    {invoice.date}
                  </p>
                  <p className="text-xs text-surface-500">
                    Invoice #{1000 - index}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-surface-900 dark:text-white">
                    {invoice.amount}
                  </span>
                  <Button variant="ghost" size="icon-sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
