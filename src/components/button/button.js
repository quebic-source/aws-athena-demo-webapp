import { Link } from 'react-router-dom';

export default function Button(props) {
    const { variant='button', color='primary', text } = props;

    let colorTheme;
    if (color==='default') {
        colorTheme = 'bg-indigo-50 hover:bg-indigo-100 text-primary-color hover:text-hover-primary-color';
    } else if (color==='error') {
        colorTheme = 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700';
    } else {
        colorTheme = 'bg-indigo-600 hover:bg-indigo-700 text-white focus:bg-indigo-600';
    }

    const className = `inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${colorTheme}`
    
    if (variant === 'link') {
        return (
            <Link
                className={className}
                {...props}
            >
                {text}
            </Link>
        )
    } else {
        return (
            <div className="relative inline-flex">
                <button
                    className={className}
                    {...props}
                >
                    {text}
                </button>
                {props.isIndicated &&
                    <div className="flex absolute top-0 right-0 -mt-0.5 -mr-1">
                          <span className="absolute inline-flex animate-ping">
                            <span className="inline-flex rounded-full h-3 w-3 bg-red-400 opacity-75"></span>
                          </span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </div>
                }

            </div>
        )
    }
    
}