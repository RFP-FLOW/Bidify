import CompanyProfileCard from "../../components/Company-profile/CompanyProfileCard";
import ManagerProfileCard from "../../components/Company-profile/ManagerProfileCard";
import ManagerLayout from "../../components/Manager/SidebarCardManager";
import Navbar from "../../components/Navbar";

const Profile = () => {
  return (
    <div className="min-h-screen bg-[#FFF6DA]">
      
      {/* TOP NAVBAR */}
      <Navbar />

      {/* SIDEBAR + PAGE CONTENT */}
      <div className="pt-4">
        <ManagerLayout>
          <div className="space-y-6">
            <CompanyProfileCard />
          </div>
        </ManagerLayout>
      </div>
    </div>
  );
};

export default Profile;
