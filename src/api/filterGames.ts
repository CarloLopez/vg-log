import { FilterList } from "./apiTypes";

const formatFilters = (filterList: FilterList) => {
  
  const queryArray = [];

  // Set sort filters
  if (filterList.sort) {
    queryArray.push(`sort ${filterList.sort.fieldSort} ${filterList.sort.sortBy}`);
  }

  // filter non-main games (e.g., DLCs, updates, bundles, mods, alternative versions, etc.), and also games without covers
  let whereQuery = 'where parent_game = null & version_parent = null & category = (0, 8, 9, 10, 11, 12) & cover != null';

  if (filterList.where) {
    const filters = filterList.where;
    whereQuery += ' & '; 
    
    const subqueryArray = [];

    // Set 'where' query filters
    // format filters to string "where {filter = filtervalues} & {filter = filtervalues}, etc."
    for (const key in filters) {
      let subquery = `${key} = `;
      
      const values = filters[key].values;
      let valueSubquery = ''
      
      if (Array.isArray(values)) {
        valueSubquery += values.join(', ');
      } else {
        valueSubquery += values;
      }

      // if user flags for exact matching, encapsulate in {} if an array, else leave without encapsulation
      if (filters[key].exact) {
        if (valueSubquery.includes(',')) valueSubquery = `{${valueSubquery}}`;
      } else {
        // else format so that search is not exact matching via [] for arrays and () for single values
        valueSubquery = valueSubquery.includes(',') ? `[${valueSubquery}]` : `(${valueSubquery})`;
      }

      subquery += valueSubquery;
      subqueryArray.push(subquery);
    }

    // Set 'specify' query filters
    if (filterList.specify) {
      const specify = filterList.specify
      subqueryArray.push(`${specify.fieldSpecify} ${specify.operator} ${specify.specifyBy}`)
    }

    whereQuery += subqueryArray.join(' & ');
  }

  queryArray.push(whereQuery);

  // Set search query filter
  if (filterList.search) {
    queryArray.push(`search "${filterList.search}"`);
  }

  // Set pagination query filters - default is first 25 results returned, page 1
  let limit = 25;
  let page = 1;

  if (filterList.pagination) {
    const pagination = filterList.pagination;
    if(pagination.limit) limit = pagination.limit;
    if(pagination.page) page = pagination.page;
  } 

  queryArray.push(`limit ${limit}`);
  queryArray.push(`offset ${limit * (page - 1)}`);

  // API query sections must be separated with semicolon
  return queryArray.join('; ');
}

const filterGames = async (filterList: FilterList) => {
  
  const query = formatFilters(filterList)

  const body = `fields cover.image_id, name, slug; ${query};`

  const url = 'https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/games';
  const headers = {
    'Accept': 'application/json',
    'Client-ID': '7700pxy9nm01xjre1zxrn8pfk0eaqy',
    'Authorization': 'Bearer 6dhvah2trquct9fss21son34vcpzz1',
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
      mode: 'cors',
    });

    console.log(`API QUERY SENT. Request: ${query}`);

    // throw error with HTTP code if API request failed
    if (!response.ok) {
      throw new Error(`HTTP error: Status ${response.status}`);
    }

    const data = await response.json();
    return data;
    
  } catch(error) {
    // verify error type before throwing new error
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error ('Unknown Error Has Occurred');
    }
  }
}

export default filterGames;