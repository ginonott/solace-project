export function Table({children}: React.PropsWithChildren) {
    return <table className="min-w-full table-auto border-collapse">{children}</table>
}

export function THead({children}: React.PropsWithChildren) {
    return <thead>
        {children}
    </thead>
}

export function TRow({children}: React.PropsWithChildren) {
    return <tr>
        {children}
    </tr>
}

export function TBody({children}: React.PropsWithChildren) {
    return <tbody>
        {children}
    </tbody>
}

export function TR({children}: React.PropsWithChildren) {
    return <tr>{children}</tr>
}

export function TH({children}: React.PropsWithChildren) {
    return <th>{children}</th>
}

export function TD({children, ...props}: React.PropsWithChildren) {
    return <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-800" {...props}>{children}</td>
}