import Button from './Button';

const LoginRightBar = ({ title, subParagraph, linkTittle, linkUrl }) => {
    return (
        <div className='w-12/12 md:w-6/12 lg:w-6/12 bg-primary text-white rounded-tr-2xl rounded-br-2xl py-36 px-12 text-center' >
            <h2 className='text-3xl font-bold mb-2'>{title}</h2>
            <div className='w-fit mx-auto'>
                <div className=' bg-white border-2 w-10 border-white inline-block mb-2'></div>
            </div>
            <p className='mb-10 '>{subParagraph}</p>
            <Button text={linkTittle} classname={'text-white border-white hover:bg-white hover:text-primary'} link={linkUrl} />
        </div>
    )
};

export default LoginRightBar;