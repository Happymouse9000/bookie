import CreateCategory from "../components/CreateCategory";
import MainNav from "../components/MainNav";

export default function categories() {
  return (
    <>
      <MainNav />
      <section className="background-img page-section py-5">
        <CreateCategory />;
      </section>
    </>
  );
}
