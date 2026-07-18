import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Nexarivo?",
    answer:
      "Nexarivo is an AI-powered productivity platform that helps you research, create, code, and analyze with intelligent AI agents.",
  },
  {
    question: "How do I get started?",
    answer:
      "Simply sign up for a free trial, choose your plan, and start using our AI agents immediately. No credit card required.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. We offer month-to-month billing with no long-term contracts.",
  },
  {
    question: "What integrations are supported?",
    answer:
      "We support integrations with OpenAI, Google, Slack, GitHub, Notion, Zapier, Stripe, and many more. Custom integrations are available for Enterprise plans.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we use enterprise-grade encryption and security measures to protect your data. All data is encrypted in transit and at rest.",
  },
  {
    question: "Do you offer team collaboration?",
    answer:
      "Yes, Professional and Enterprise plans include team collaboration features, allowing you to work together seamlessly.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-32">
      <div className="container max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about Nexarivo
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border-border">
              <AccordionTrigger className="text-left hover:text-accent transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
