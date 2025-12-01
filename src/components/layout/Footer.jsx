import packageJson from '../../../package.json';

const Footer = () => {
    const version = JSON.stringify(packageJson.version);
    return (
        <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-xs font-mono">
                <p>v{version.replace(/"/g, '')}</p>
                <div className="mt-4 text-xs text-slate-600">
                    <p>
                        Disclaimer: This game is a simulation and not a real trading platform. The in-game currency has no real-world value and is not intended for any malicious intent.
                    </p>
                    <p className="mt-1">
                        Please play responsibly and understand that this is for entertainment purposes only.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
