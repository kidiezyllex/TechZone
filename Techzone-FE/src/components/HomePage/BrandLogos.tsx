
const logos = [
  {
    name: 'Item1',
    url: 'https://bizweb.dktcdn.net/thumb/medium/100/287/440/products/vi-da-local-brand-identity-wallet-41-f9532d22-7df5-4336-8329-5770e23b58b8.jpg?v=1722843697950',
  },
  {
    name: 'Item2',
    url: 'https://bizweb.dktcdn.net/thumb/medium/100/287/440/products/vi-da-local-brand-identity-wallet-47.jpg?v=1722841740327',
  },
  {
    name: 'Item3',
    url: 'https://bizweb.dktcdn.net/thumb/medium/100/287/440/products/non-local-brand-dep-mau-hong-vai-khaki-davies-3-d4cb7dad-b4d9-49a8-beeb-b5abac3fa026.jpg?v=1719818371007',
  },
  {
    name: 'Item4',
    url: 'https://bizweb.dktcdn.net/thumb/medium/100/287/440/products/mu-snapback-nam-nu-vai-canvas-den-phoi-trang-5.jpg?v=1718441097300',
  },
  {
    name: 'Item5',
    url: 'https://bizweb.dktcdn.net/thumb/large/100/287/440/products/balo-da-di-hoc-nam-nu-mau-den-hoa-tiet-nhieu-ngan-local-brand-6.jpg?v=1699926252040',
  },
  {
    name: 'Item6',
    url: 'https://bizweb.dktcdn.net/thumb/large/100/287/440/products/balo-di-hoc-local-brand-da-mau-den-davies-7-e3736f2e-633e-423c-a0a9-ee3ae8da25c8-1.jpg?v=1722415154220',
  },
  {
    name: 'Item7',
    url: 'https://bizweb.dktcdn.net/thumb/large/100/287/440/products/vi-canvas-local-brand-dep.jpg?v=1604226810867',
  },
  {
    name: 'Item8',
    url: 'https://bizweb.dktcdn.net/thumb/large/100/287/440/products/bag-51db9b8a-e8eb-4583-9ac3-5e67f751f095.jpg?v=1556272278123',
  },
  {
    name: 'Item9',
    url: 'https://bizweb.dktcdn.net/thumb/large/100/287/440/products/3-997d1a6e-3c83-4e65-8c67-ff9f00280bc9.jpg?v=1560993463033',
  },
  {
    name: 'Item10',
    url: 'https://bizweb.dktcdn.net/thumb/large/100/287/440/products/leatherback1.jpg?v=1562643927230',
  },
  {
    name: 'Item11',
    url: 'https://bizweb.dktcdn.net/thumb/large/100/287/440/products/dsw-sock-1.jpg?v=1556270222413',
  },
];

export const BrandLogos = () => {
  return (
    <section className="py-12 pb-0 bg-gradient-to-br bg-white relative overflow-hidden">
         <h2 className="text-2xl font-bold text-center mb-8 relative">
          <span className="uppercase bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-sm ">
            Các phụ kiện bán chạy nhẩt
          </span>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
        </h2>
      {}
      {}
      <div className="container mx-auto relative z-10">
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          {}
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-logo-cloud">
            {logos.map((logo) => (
              <li key={logo.name} className="flex items-center justify-center w-[150px]">
                <img
                  draggable={false}
                  src={logo.url}
                  alt={logo.name}
                  width={1000}
                  height={1000}
                  className="max-h-44 object-contain select-none"
                />
              </li>
            ))}
          </ul>
          
          {}
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-logo-cloud" aria-hidden="true">
            {logos.map((logo) => (
              <li key={logo.name} className="flex items-center justify-center w-[150px]">
                <img
                  draggable={false}
                  src={logo.url}
                  alt={logo.name}
                  width={1000}
                  height={1000}
                  className="max-h-44 object-contain select-none"
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