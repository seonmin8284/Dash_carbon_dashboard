import React from "react";

interface CompanyRanking {
  rank: number;
  company: string;
  industry: string;
  reductionRate: number;
  allocationEfficiency: number;
  esgScore: number;
  totalScore: number;
}

interface ESGRankingTableProps {
  rankings: CompanyRanking[];
  currentCompany: string;
}

const ESGRankingTable: React.FC<ESGRankingTableProps> = ({
  rankings,
  currentCompany,
}) => {
  return (
    <div className="lg:col-span-2">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        업종별 ESG 랭킹
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                순위
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                기업명
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                업종
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                감축률
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                ESG점수
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                종합점수
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rankings.map((company, index) => (
              <tr
                key={index}
                className={`${
                  company.company === currentCompany
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm ${
                      company.rank === 1
                        ? "bg-yellow-500"
                        : company.rank === 2
                        ? "bg-gray-400"
                        : company.rank === 3
                        ? "bg-yellow-600"
                        : "bg-gray-300"
                    }`}
                  >
                    {company.rank}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {company.company}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {company.industry}
                </td>
                <td className="px-4 py-3 text-green-600 font-semibold">
                  {company.reductionRate}%
                </td>
                <td className="px-4 py-3 text-blue-600 font-semibold">
                  {company.esgScore}
                </td>
                <td className="px-4 py-3 text-gray-900 font-semibold">
                  {company.totalScore}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ESGRankingTable;
