type HeaderProps = {text: string};

export default function Header({text} : HeaderProps) {
    return <h1 className="text-4xl font-bold capitalize mb-8 bg-[#265b4e] text-white p-4">{text}</h1>
}