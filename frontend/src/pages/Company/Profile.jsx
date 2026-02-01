import CompanyProfileCard from "../../components/Company-profile/CompanyProfileCard";
import ManagerLayout from "../../components/Manager/SidebarCardManager";

const Profile = () => {
  return (
    <div className="min-h-screen bg-[#FFF6DA]">
    
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
