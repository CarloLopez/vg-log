import { FilterList } from "./apiTypes";

const formatFilters = (filterList: FilterList) => {
  
  const queryArray = [];

  // Set sort filters
  if (filterList.sort) {
    queryArray.push(`sort ${filterList.sort.fieldSort} ${filterList.sort.sortBy}`);
  }

  if (filterList.where) {
    const filters = filterList.where;
    let whereQuery = 'where ';
    const subqueryArray = [];

    // Set 'where' query filters
    // format filters to string "where {filter = filtervalues} & {filter = filtervalues}, etc."
    for (const key in filters) {
      let subquery = `${key} = `;
      
      const values = filters[key].values;
      let valueSubquery = ''
      
      if (Array.isArray(values)) {
        valueSubquery += values.join(', ')
      } else {
        valueSubquery += values;
      }

      // default filtering is AND matching
      switch(filters[key].match) {
        case 'exact':
          //pass
          break;
        case 'or':
          valueSubquery = `(${valueSubquery})`;
          break;
        default:
          valueSubquery = `[${valueSubquery}]`;
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
    queryArray.push(whereQuery);
  }

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
  queryArray.push(`offset ${limit * page}`);

  // API query sections must be separated with semicolon
  return queryArray.join('; ');
}

const filterGames = async (filterList: FilterList) => {
  
  const query = formatFilters(filterList)
  console.log(query);

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