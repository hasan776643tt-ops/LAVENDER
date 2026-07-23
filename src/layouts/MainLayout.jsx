import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  return (
    <div>

      <Header />

      <div>

        <Sidebar />

        <main>
          {children}
        </main>

      </div>

      <Footer />

    </div>
  );
}
