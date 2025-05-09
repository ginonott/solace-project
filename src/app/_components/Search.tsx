type SearchProps = {
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
};

export default function Search({ onSearch, onReset, inputRef }: SearchProps) {
  return (
    <div className="flex flex-col space-y-2 max-w-md my-8">
      <label htmlFor="search" className="text-sm font-medium">
        Search
      </label>
      <div>
        <input
          name="search"
          className="border border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-10"
          onChange={onSearch}
          type="text"
          role="searchbox"
          ref={inputRef}
        />
        <button
          onClick={onReset}
          className="self-start px-4 py-2 text-sm font-medium border rounded border-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Reset Search
        </button>
      </div>
    </div>
  );
}
