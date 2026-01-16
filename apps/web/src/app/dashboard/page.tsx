'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText,
  Cloud,
  Settings,
  CreditCard,
  Users,
  Zap,
  HardDrive,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  Download,
  Upload,
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { Button } from '@omnipdf/ui/src/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@omnipdf/ui/src/Card';
import { formatBytes, formatRelativeTime } from '@omnipdf/shared/src/utils';
import { Skeleton } from '@/components/ui/Skeleton';

interface Document {
  id: string;
  original_filename: string;
  original_format: string;
  file_size: number;
  status: string;
  created_at: string;
}

interface UsageStats {
  total_conversions: number;
  storage_used: number;
  ai_credits_used: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<UsageStats>({
    total_conversions: 0,
    storage_used: 0,
    ai_credits_used: 0,
  });
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (!session) {
          router.push('/auth/login');
          return;
        }
        setSession(session);

        // Fetch user data
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!isMounted) return;

        if (userData) {
          setSubscription(userData);
        }

        // Fetch recent documents
        const { data: docsData } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (!isMounted) return;

        if (docsData) {
          setDocuments(docsData);
        }

        setLoading(false);
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    getSession();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 p-8">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const quickActions = [
    { icon: Upload, label: 'Upload & Convert', href: '/convert', color: 'from-blue-500 to-blue-600' },
    { icon: FileText, label: 'Recent Files', href: '/dashboard#recent', color: 'from-purple-500 to-purple-600' },
    { icon: Cloud, label: 'Cloud Storage', href: '/dashboard#cloud', color: 'from-green-500 to-green-600' },
    { icon: Settings, label: 'Settings', href: '/settings', color: 'from-gray-500 to-gray-600' },
  ];

  const statsCards = [
    {
      icon: Zap,
      label: 'Conversions This Month',
      value: stats.total_conversions,
      color: 'from-yellow-400 to-orange-500',
    },
    {
      icon: HardDrive,
      label: 'Storage Used',
      value: formatBytes(stats.storage_used),
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: TrendingUp,
      label: 'AI Credits Used',
      value: stats.ai_credits_used,
      color: 'from-pink-400 to-pink-600',
    },
    {
      icon: Clock,
      label: 'Member Since',
      value: session?.user?.created_at 
        ? formatRelativeTime(session.user.created_at)
        : 'Recently',
      color: 'from-green-400 to-green-600',
    },
  ];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Header */}
      <header className="bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
              Dashboard
            </h1>
            <Link href="/convert">
              <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                New Conversion
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
            Welcome back, {session?.user?.user_metadata?.name || session?.user?.email}!
          </h2>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Here&apos;s an overview of your PDF activity
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card padding="md">
                <div className="flex items-center gap-3">
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-surface-500">{stat.label}</p>
                    <p className="text-xl font-bold text-surface-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Card hover padding="md" className="h-full">
                <div className="flex flex-col items-center text-center">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} text-white mb-3`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium text-surface-900 dark:text-white">
                    {action.label}
                  </h3>
                </div>
              </Card>
            </Link>
          ))}
        </motion.div>

        {/* Recent Documents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card padding="none">
            <CardHeader className="border-b border-surface-200 dark:border-surface-700">
              <div className="flex items-center justify-between">
                <CardTitle>Recent Documents</CardTitle>
                <Link href="/dashboard/documents">
                  <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {documents.length > 0 ? (
                <div className="divide-y divide-surface-100 dark:divide-surface-800">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-4 p-4 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-surface-900 dark:text-white">
                          {doc.original_filename}
                        </p>
                        <p className="text-sm text-surface-500">
                          {formatBytes(doc.file_size)} • {formatRelativeTime(doc.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          doc.status === 'completed' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : doc.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-400'
                        }`}>
                          {doc.status}
                        </span>
                        <Button variant="ghost" size="icon-sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <FileText className="mx-auto h-12 w-12 text-surface-400" />
                  <p className="mt-4 text-surface-600 dark:text-surface-400">
                    No documents yet
                  </p>
                  <Link href="/convert" className="mt-4 inline-block">
                    <Button variant="primary" size="sm">
                      Upload Your First Document
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Subscription Banner (if free tier) */}
        {subscription?.subscription_tier === 'free' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-primary-600 to-accent-600 text-white border-0">
              <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">Upgrade to Pro</h3>
                  <p className="mt-1 text-white/80">
                    Get unlimited conversions, 50GB storage, and AI-powered features
                  </p>
                </div>
                <Link href="/pricing">
                  <Button variant="secondary" size="lg">
                    View Plans
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}
