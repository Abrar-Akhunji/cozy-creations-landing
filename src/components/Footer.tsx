const Footer = () => {
  return (
    <footer className="bg-foreground py-8">
      <div className="max-w-content mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div>
            <img
              src="/Instagram%20post%20-%201.png"
              alt="TwinHooks Logo"
              className="h-10 w-auto brightness-0 invert"
            />
          </div>

          {/* Copyright */}
          <p className="text-sm" style={{ color: 'rgb(209, 213, 219)' }}>
            © {new Date().getFullYear()} TwinHooks. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;