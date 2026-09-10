

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-1" aria-label="Site footer">
            <p className="text-center blue-text mt-1">
                Shopping Cart Ecommerce &copy; 2022–{currentYear}, All Rights Reserved
            </p>
        </footer>
    );
};

export default Footer;