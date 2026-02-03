import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <p className="footer-class">© {currentYear} Blog Post | All Rights Reserved.</p>
    </footer>
  );
}

export default Footer;
