import React, { useState } from "react"

type SearchBarProps = {
  onSearch: (searchTerm: string) => void;
  initialValue: string|"";
}

const SearchBar = ({ onSearch, initialValue }: SearchBarProps) => {

  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchTerm);
    }
  }

  return (
    <>
      <input 
        type="text"
        value={searchTerm} 
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search Games..."
        className="text-black"
      />
    </>
  )
}

export default SearchBar;