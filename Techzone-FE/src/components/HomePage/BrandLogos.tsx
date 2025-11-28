
const logos = [
  {
    name: 'ASUS',
    url: 'https://logos-world.net/wp-content/uploads/2020/07/Asus-Logo.png',
  },
  {
    name: 'Dell',
    url: 'https://logos-world.net/wp-content/uploads/2020/08/Dell-Logo.png',
  },
  {
    name: 'HP',
    url: 'https://logos-world.net/wp-content/uploads/2020/11/HP-Logo.png',
  },
  {
    name: 'Lenovo',
    url: 'https://logos-world.net/wp-content/uploads/2022/07/Lenovo-Logo.png',
  },
  {
    name: 'Apple',
    url: 'https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png',
  },
  {
    name: 'MSI',
    url: 'https://logos-world.net/wp-content/uploads/2020/11/MSI-Logo.png',
  },
  {
    name: 'NVIDIA',
    url: 'https://logos-world.net/wp-content/uploads/2020/11/Nvidia-Logo.png',
  },
  {
    name: 'Intel',
    url: 'https://logos-world.net/wp-content/uploads/2021/09/Intel-Logo.png',
  },
  {
    name: 'AMD',
    url: 'https://logos-world.net/wp-content/uploads/2020/03/AMD-Logo.png',
  },
  {
    name: 'Corsair',
    url: 'https://logos-world.net/wp-content/uploads/2023/01/Corsair-Logo.png',
  },
  {
    name: 'Razer',
    url: 'https://logos-world.net/wp-content/uploads/2020/11/Razer-Logo.png',
  },
];

export const BrandLogos = () => {
  return (
    <section className="py-12 pb-0 bg-gradient-to-br bg-white relative overflow-hidden">
      <h2 className="text-2xl font-bold text-center mb-8 relative">
        <span className="uppercase bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-sm ">
          Thương hiệu đối tác
        </span>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
      </h2>
      <div className="container mx-auto relative z-10">
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-2 [&_img]:max-w-none animate-logo-cloud">
            {logos.map((logo) => (
              <li key={logo.name} className="flex items-center justify-center w-[150px]">
                <img
                  draggable={false}
                  src={logo.url}
                  alt={logo.name}
                  width={1000}
                  height={1000}
                  className="max-h-16 h-16 object-contain select-none"
                />
              </li>
            ))}
          </ul>
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-2 [&_img]:max-w-none animate-logo-cloud" aria-hidden="true">
            {logos.map((logo) => (
              <li key={logo.name} className="flex items-center justify-center w-[150px]">
                <img
                  draggable={false}
                  src={logo.url}
                  alt={logo.name}
                  width={1000}
                  height={1000}
                  className="max-h-16 h-16 object-contain select-none"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default BrandLogos; 