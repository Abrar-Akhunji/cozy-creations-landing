import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, Instagram, Facebook, MapPin, ArrowRight } from "lucide-react";
import darkYarnBg from "@/assets/dark-yarn-bg.jpg";

const Contact = () => {
  const whatsappNumber = "919586030292";
  const whatsappMessage = "Hello! I'd like to discuss a custom order.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "+91 9586030292",
      link: "tel:+919586030292",
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: "@handmade_crochet",
      link: "https://instagram.com/handmade_crochet",
    },
    {
      icon: Facebook,
      label: "Facebook",
      value: "Handmade Crochet",
      link: "https://facebook.com/handmadecrochet",
    },
  ];

  return (
    <section
      id="contacts"
      className="relative py-24 md:py-32"
      style={{
        backgroundImage: `linear-gradient(rgba(46, 42, 38, 0.92), rgba(46, 42, 38, 0.92)), url(${darkYarnBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        // NOTE: fixed backgrounds are janky on many mobile browsers
        backgroundAttachment: "scroll",
      }}
    >
      <div className="max-w-content mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <p className="text-accent font-medium text-sm uppercase tracking-wider mb-3">
            Get in Touch
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold mb-4" style={{ color: 'white' }}>
            Let's Create Together
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgb(209, 213, 219)' }}>
            Have a custom design in mind? Want to learn more about our products?
            Reach out and let's bring your vision to life.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid lg:grid-cols-3 gap-8 md:gap-12 items-start">
          {/* Left - Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                target={info.link.startsWith("http") ? "_blank" : undefined}
                rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-start gap-4 p-6 rounded-xl bg-card/10 backdrop-blur-sm border border-accent/20 hover:bg-card/20 hover:border-accent/40 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <info.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-accent mb-1">
                    {info.label}
                  </p>
                  <p className="font-medium" style={{ color: 'white' }}>
                    {info.value}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Center - CTA */}
          <div className="flex items-center justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full text-lg px-8 py-6 h-auto bg-primary hover:bg-primary/90 transition-all duration-300 hover:-translate-y-1 shadow-hover"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                Contact me
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
          </div>

          {/* Right - Map */}
          <Card className="overflow-hidden rounded-2xl shadow-card h-64 lg:h-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841311267733!2d-73.98784368459395!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location map"
            />
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;