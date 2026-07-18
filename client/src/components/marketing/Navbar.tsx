import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-purple-500 rounded-xl blur opacity-75"></div>
            <div className="relative w-10 h-10 bg-gradient-to-br from-yellow-400 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-background font-bold text-lg">N</span>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-xl bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
              NEXARIVO-AI
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 relative group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => startLogin()}
            className="hidden sm:inline-flex border-border hover:bg-card"
          >
            Sign In
          </Button>
          <Button
            size="sm"
            onClick={() => startLogin()}
            className="bg-gradient-to-r from-yellow-400 to-purple-500 text-background hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 font-semibold gap-2 group"
          >
            Get Started
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-card rounded-lg transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card/80 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="container py-4 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 border-t border-border space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  startLogin();
                  setIsOpen(false);
                }}
                className="w-full"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  startLogin();
                  setIsOpen(false);
                }}
                className="w-full bg-gradient-to-r from-yellow-400 to-purple-500 text-background hover:shadow-lg"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
