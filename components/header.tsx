import Link from 'next/link'

export default function Header() {
    return (
        <header className="p-4 border-b-2 border-gray-300 fixed w-full bg-white">
            <ul className="w-full max-w-xl m-auto flex font-medium flex-row">
                <li>
                    <Link className="text-gray-700 hover:text-blue-700" href="/">Home</Link>
                </li>
            </ul>
        </header>
    )
}