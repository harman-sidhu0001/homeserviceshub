import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";

const LocationSelector = ({ setValue, errors, className = "", label = "Location" }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry));
      setCities([]);
      setSelectedState("");
      setSelectedCity("");
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      setCities(City.getCitiesOfState(selectedCountry, selectedState));
      setSelectedCity("");
    }
  }, [selectedState, selectedCountry]);

  // Update the parent form value whenever selection changes
  useEffect(() => {
    if (selectedCity && selectedState && selectedCountry) {
      const countryName = Country.getCountryByCode(selectedCountry)?.name;
      const stateName = State.getStateByCodeAndCountry(selectedState, selectedCountry)?.name;
      // City name is just the value since we store name or object? 
      // City.getCitiesOfState returns objects with name.
      // Let's assume selectedCity stores the name directly for simplicity in the select value, 
      // or we store the object.
      // Actually, standard selects usually store string values.
      
      // Let's verify what we store in state.
      // If we store ISO codes for Country/State, we need to look up names.
      // For City, it doesn't have a unique ISO code usually, just name.
      
      const locationString = `${selectedCity}, ${stateName}, ${countryName}`;
      setValue("location", locationString, { shouldValidate: true });
    }
  }, [selectedCity, selectedState, selectedCountry, setValue]);

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Country Select */}
        <div className="relative">
          <select
            className="w-full px-4 py-3 border border-accent rounded-lg focus:ring-0 focus:border-primary focus-visible:outline-none transition-all appearance-none bg-white"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>

        {/* State Select */}
        <div className="relative">
          <select
            className="w-full px-4 py-3 border border-accent rounded-lg focus:ring-0 focus:border-primary focus-visible:outline-none transition-all appearance-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            disabled={!selectedCountry}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>
           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>

        {/* City Select */}
        <div className="relative">
          <select
            className="w-full px-4 py-3 border border-accent rounded-lg focus:ring-0 focus:border-primary focus-visible:outline-none transition-all appearance-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedState}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      {errors?.location && (
        <p className="text-sm text-error mt-1">{errors.location.message}</p>
      )}
    </div>
  );
};

export default LocationSelector;
