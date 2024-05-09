import { Product } from '../models/product';

export class FakeProductRepo {
  products: Product[] = [
    {
      id: `P001`,
      name: `bottle of water`,
      unitPrice: 3,
      uom: `EA`,
      stock: 5,
    },
    {
      id: `P002`,
      name: `Soft Drink`,
      unitPrice: 2,
      uom: `CARTE`,
      stock: 100,
    },
    {
      id: `P003`,
      name: `Pillow`,
      uom: `EA`,
      unitPrice: 6,
      stock: 50,
    },
    {
      id: `P004`,
      name: `Camera`,
      uom: `EA`,
      unitPrice: 800,
      stock: 3,
    },
    {
      id: `P005`,
      name: `Running Shoes`,
      uom: `PAIR`,
      unitPrice: 150,
      stock: 98,
    },
    {
      id: `P006`,
      name: `Socks`,
      uom: `PAIR`,
      unitPrice: 3,
      stock: 50,
    },
    {
      id: `P007`,
      name: `Computer`,
      uom: `EA`,
      unitPrice: 1000,
      stock: 12,
    },
    {
      id: `P008`,
      name: `Mug`,
      uom: `EA`,
      unitPrice: 9.8,
      stock: 68,
    },
    {
      id: `P009`,
      name: `Sugar (300g)`,
      uom: `G`,
      unitPrice: 1.98,
      stock: 8,
    },
    {
      id: `P010`,
      name: `PEN`,
      uom: `EA`,
      unitPrice: 1,
      stock: 80,
    },
  ];
}
