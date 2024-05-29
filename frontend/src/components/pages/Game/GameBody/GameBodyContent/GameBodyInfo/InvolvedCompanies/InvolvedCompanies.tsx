import { Company } from "../../../../../../../types/gameTypes";
import LinkArray from "../../../../../../common/Array/LinkArray";

type InvolvedCompaniesProps = {
  companies: Company[];
  filter: string;
}

const getCompanyNameArray = (companies: Company[]) => {
  return (
    companies.map((company) => {
      return company.company;
    })
  )
}

const InvolvedCompanies = ({ companies, filter }: InvolvedCompaniesProps) => {
  
  let companyArray: Company[] = [];

  switch (filter) {
    case 'developers':
      companyArray = companies.filter(company => company.developer === true);
      break;
    case 'publishers':
      companyArray = companies.filter(company => company.publisher === true);
      break;
    case 'supporters':
      companyArray = companies.filter(company => company.supporting === true);
      break;
    default:
      return <div>Filter Error.</div>
  }
  
  if (!companyArray.length) {
    return <div>N/A</div>
  } else {
    const companyNameArray = getCompanyNameArray(companyArray);
    return <LinkArray items={companyNameArray}/>
  }
}

export default InvolvedCompanies;