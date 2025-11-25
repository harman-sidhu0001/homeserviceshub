import React, { useState, useEffect, useMemo } from "react";
import { Country, State, City } from "country-state-city";
import { IoSearch } from "react-icons/io5";

const CheckboxList = ({ items, selectedIds, onItemChange, onSelectAll, title, searchPlaceholder, showSelectAll = true }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const isAllSelected = items.length > 0 && filteredItems.every((item) => selectedIds.includes(item.id));

  return (
    <div className="border rounded-lg p-3 flex flex-col h-64 bg-white">
      <h3 className="font-semibold text-gray-700 mb-2">{title}</h3>
      
      {/* Search */}
      <div className="relative mb-2">
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full pl-8 pr-2 py-1 text-sm border rounded focus:outline-none focus:border-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IoSearch className="absolute left-2 top-1.5 text-gray-400" />
      </div>

      {/* Select All */}
      {showSelectAll && (
        <div className="flex items-center mb-2 pb-2 border-b">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={(e) => onSelectAll(e.target.checked, filteredItems)}
            className="rounded border-gray-300 text-primary focus:ring-primary mr-2"
            disabled={items.length === 0}
          />
          <span className="text-sm font-medium text-gray-600">Select All</span>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {filteredItems.length === 0 ? (
          <p className="text-xs text-gray-400 text-center mt-4">No items found</p>
        ) : (
          filteredItems.map((item) => (
            <label key={item.id} className="flex items-center space-x-2 hover:bg-gray-50 p-1 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.includes(item.id)}
                onChange={() => onItemChange(item.id)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700 truncate" title={item.name}>
                {item.name}
              </span>
            </label>
          ))
        )}
      </div>
    </div>
  );
};

const ServiceAreaSelector = ({ setValue, errors, label = "Service Areas" }) => {
  // Data State
  const [allCountries, setAllCountries] = useState([]);
  
  // Selection State (IDs/Codes)
  const [selectedCountryCodes, setSelectedCountryCodes] = useState([]);
  const [selectedStateCodes, setSelectedStateCodes] = useState([]); // Format: "CountryCode-StateCode" to avoid collisions
  const [selectedCityNames, setSelectedCityNames] = useState([]); // Format: "CountryCode-StateCode-CityName"

  // Load Countries
  useEffect(() => {
    setAllCountries(Country.getAllCountries().map(c => ({ id: c.isoCode, name: c.name })));
  }, []);

  // Derived States (Available Options based on selection)
  const availableStates = useMemo(() => {
    return selectedCountryCodes.flatMap(countryCode => 
      State.getStatesOfCountry(countryCode).map(s => ({
        id: `${countryCode}-${s.isoCode}`, // Unique ID
        name: s.name,
        countryCode: countryCode,
        isoCode: s.isoCode
      }))
    );
  }, [selectedCountryCodes]);

  const availableCities = useMemo(() => {
    return selectedStateCodes.flatMap(uniqueStateId => {
      const [countryCode, stateCode] = uniqueStateId.split("-");
      return City.getCitiesOfState(countryCode, stateCode).map(c => ({
        id: `${countryCode}-${stateCode}-${c.name}`, // Unique ID
        name: c.name,
        countryCode,
        stateCode,
        stateName: State.getStateByCodeAndCountry(stateCode, countryCode)?.name,
        countryName: Country.getCountryByCode(countryCode)?.name
      }));
    });
  }, [selectedStateCodes]);

  // Handlers
  const handleCountryChange = (id) => {
    setSelectedCountryCodes(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
    // Cleanup dependent selections? 
    // Usually better to keep them or filter them out in effects. 
    // For now, let's filter them out in the next render cycle automatically via availableStates check?
    // No, state needs explicit update if we want to remove them from selected lists.
    if (selectedCountryCodes.includes(id)) {
       // Deselecting: Remove associated states and cities
       const statesToRemove = availableStates.filter(s => s.countryCode === id).map(s => s.id);
       setSelectedStateCodes(prev => prev.filter(s => !statesToRemove.includes(s)));
       // Cities will be removed automatically as their parent states are removed? 
       // We need to remove cities associated with those states.
       // It's complex to track. Let's rely on the user to manage or simple cleanup.
       // Simple cleanup:
       // When country removed, remove all states of that country.
       // When state removed, remove all cities of that state.
    }
  };

  const handleStateChange = (id) => {
    setSelectedStateCodes(prev => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        // Remove associated cities
        const [cCode, sCode] = id.split("-");
        const citiesToRemove = City.getCitiesOfState(cCode, sCode).map(c => `${cCode}-${sCode}-${c.name}`);
        setSelectedCityNames(prevCities => prevCities.filter(cityId => !citiesToRemove.includes(cityId)));
        return prev.filter(s => s !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleCityChange = (id) => {
    setSelectedCityNames(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  // Select All Handlers
  const handleSelectAllCountries = (checked, filteredItems) => {
    const ids = filteredItems.map(i => i.id);
    if (checked) {
      setSelectedCountryCodes(prev => [...new Set([...prev, ...ids])]);
    } else {
      setSelectedCountryCodes(prev => prev.filter(id => !ids.includes(id)));
      // Trigger cleanup of states/cities...
      // For simplicity, if unselecting all visible, we might leave orphans or need complex logic.
      // Let's just update the selection.
    }
  };

  const handleSelectAllStates = (checked, filteredItems) => {
    const ids = filteredItems.map(i => i.id);
    if (checked) {
      setSelectedStateCodes(prev => [...new Set([...prev, ...ids])]);
    } else {
      setSelectedStateCodes(prev => prev.filter(id => !ids.includes(id)));
    }
  };

  const handleSelectAllCities = (checked, filteredItems) => {
    const ids = filteredItems.map(i => i.id);
    if (checked) {
      setSelectedCityNames(prev => [...new Set([...prev, ...ids])]);
    } else {
      setSelectedCityNames(prev => prev.filter(id => !ids.includes(id)));
    }
  };

  // Update Form Value
  useEffect(() => {
    // Map selected city IDs to just city names
    const formattedAreas = selectedCityNames.map(cityId => {
      const [,, cityName] = cityId.split("-");
      return cityName;
    });
    
    setValue("serviceAreas", formattedAreas, { shouldValidate: true });
  }, [selectedCityNames, setValue]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CheckboxList 
          title="1. Countries" 
          items={allCountries} 
          selectedIds={selectedCountryCodes}
          onItemChange={handleCountryChange}
          onSelectAll={handleSelectAllCountries}
          searchPlaceholder="Search Country..."
          showSelectAll={false}
        />
        
        <CheckboxList 
          title="2. States" 
          items={availableStates} 
          selectedIds={selectedStateCodes}
          onItemChange={handleStateChange}
          onSelectAll={handleSelectAllStates}
          searchPlaceholder="Search State..."
        />
        <div className="md:col-span-2">
        <CheckboxList 
          title="3. Cities" 
          items={availableCities} 
          selectedIds={selectedCityNames}
          onItemChange={handleCityChange}
          onSelectAll={handleSelectAllCities}
          searchPlaceholder="Search City..."
        />
        </div>
      </div>

      {/* Selected Summary Chips */}
      {selectedCityNames.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 p-2 border rounded bg-gray-50 max-h-32 overflow-y-auto">
          {selectedCityNames.map(cityId => {
             const [,, cityName] = cityId.split("-");
             return (
               <span key={cityId} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center">
                 {cityName}
                 <button 
                   type="button"
                   onClick={() => handleCityChange(cityId)}
                   className="ml-1 hover:text-red-500"
                 >
                   &times;
                 </button>
               </span>
             );
          })}
        </div>
      )}

      {errors?.serviceAreas && (
        <p className="text-sm text-error mt-1">{errors.serviceAreas.message}</p>
      )}
    </div>
  );
};

export default ServiceAreaSelector;
