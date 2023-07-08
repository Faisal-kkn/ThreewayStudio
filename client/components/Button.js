import Link from 'next/link';

const PrimaryButton = ({ text, classname, link }) => {
    return (
        <button type={link ? '' : 'submit'} className={`border-2 rounded-full px-12 py-2 inline-block font-semibold ${classname}`}>
            {link ? (
                <Link href={`/${link}`} legacyBehavior>
                    <a>{text}</a>
                </Link>
            ) : (
                text
            )}
        </button>
    );
};

export default PrimaryButton;
