import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FAQCategory } from "@/components/ui/FAQComponents";

export const metadata: Metadata = {
  title: "FAQ - OmniPDF | Frequently Asked Questions",
  description:
    "Find answers to frequently asked questions about OmniPDF features, pricing, and security.",
};

const FAQ_CATEGORIES = [
  {
    name: "General",
    questions: [
      {
        question: "What is OmniPDF?",
        answer:
          "OmniPDF is a comprehensive PDF solution that offers powerful tools for converting, editing, merging, splitting, and managing PDF documents.",
      },
      {
        question: "Is OmniPDF free to use?",
        answer:
          "Yes! OmniPDF offers a generous free tier with 25 conversions per month. Upgrade to Pro ($7.99/month) or Enterprise ($24.99/month) for unlimited access.",
      },
      {
        question: "What file formats does OmniPDF support?",
        answer:
          "OmniPDF supports over 25 formats including PDF, DOCX, DOC, XLSX, XLS, PPTX, PPT, JPG, PNG, HTML, TXT, and many more.",
      },
      {
        question: "Is my data secure with OmniPDF?",
        answer:
          "Absolutely. We use AES-256 encryption, automatically delete processed files after 24 hours, and offer zero-knowledge architecture options.",
      },
    ],
  },
  {
    name: "Conversion",
    questions: [
      {
        question: "How long does PDF conversion take?",
        answer:
          "Most conversions complete within seconds. Larger documents may take 1-2 minutes.",
      },
      {
        question: "Can I convert scanned PDFs to editable formats?",
        answer:
          "Yes, our OCR feature can extract text from scanned PDFs and images.",
      },
      {
        question: "Is there a file size limit?",
        answer: "Free: 25MB, Pro: 500MB, Enterprise: 2GB limits.",
      },
    ],
  },
  {
    name: "Account & Billing",
    questions: [
      {
        question: "How do I change my subscription plan?",
        answer:
          "Upgrade or downgrade from Settings > Subscription. Changes take effect immediately.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.",
      },
      {
        question: "Can I get a refund?",
        answer: "We offer a 14-day money-back guarantee for all paid plans.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-950">
      <Header />

      <main>
        <section className="bg-surface-50 dark:bg-surface-900 py-16">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-4xl font-bold text-surface-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-surface-600 dark:text-surface-400">
              Find answers to common questions about OmniPDF
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4">
            {FAQ_CATEGORIES.map((category) => (
              <FAQCategory
                key={category.name}
                name={category.name}
                questions={category.questions}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
