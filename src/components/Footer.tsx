const Footer = () => {
  return (
    <footer className="bg-foreground py-8">
      <div className="max-w-content mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div
            className="text-xl font-semibold"
            style={{ 
              fontFamily: "'Poppins', cursive",
              color: 'rgb(234, 216, 188)'
            }}
          >
            Handmade
          </div>

          {/* Copyright */}
          <p className="text-sm" style={{ color: 'rgb(209, 213, 219)' }}>
            © {new Date().getFullYear()} Handmade Crochet Artisan. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;