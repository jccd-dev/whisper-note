import Image from 'next/image';
import cuteImage from '../../../public/images/cutie.gif';

export default function LoadingMessage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50">
            <div className="w-44 sm:w-56 lg:w-60 border-8 border-pink-600 rounded-md overflow-hidden mb-6">
                <div className="w-full rounded-md overflow-hidden">
                    <Image
                        src={cuteImage}
                        alt="Cute Image"
                        className="w-full"
                    />
                </div>
            </div>
            <h1 className="text-xl lg:text-3xl font-bold text-pink-600 mb-2 mx-8 text-center">
                Im thinking of a message for you....
            </h1>
        </div>
    );
}
