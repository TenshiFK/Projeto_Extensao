

export default async function Tables() {

    return (
    <table className="w-full border-collapse border border-gray-400 ...">
        <thead>
          <tr>
            <th className="border border-gray-300 ...">State</th>
            <th className="hidden md:block border border-gray-300 ...">City</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 ...">Indiana</td>
            <td className="hidden md:block border border-gray-300 ...">Indianapolis</td>
          </tr>
          <tr>
            <td className="border border-gray-300 ...">Ohio</td>
            <td className="hidden md:block border border-gray-300 ...">Columbus</td>
          </tr>
          <tr>
            <td className="border border-gray-300 ...">Michigan</td>
            <td className="hidden md:block border border-gray-300 ...">Detroit</td>
          </tr>
        </tbody>
      </table>
    );
}