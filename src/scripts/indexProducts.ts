const { MeiliSearch } = require('meilisearch');
const fs = require('fs/promises');
const path = require('path');

async function indexProducts() {
  try {
    const client = new MeiliSearch({
      host: 'https://ms-dee76a5e346f-22280.sgp.meilisearch.io',
      apiKey: 'd378a3197171c336dd3d1e88aad1f2308b8a8d29c69d55b568b4a0a40a2a4fa4', // Use your admin/master key here, not the search key
    });

    // Example: Load products from a JSON file
    // In a real app, you'd fetch from your database
    const productsPath = path.join(process.cwd(), 'data', 'products.json');
    
    // Create products.json if it doesn't exist
    try {
      await fs.access(productsPath);
    } catch (error) {
      // Create the data directory if it doesn't exist
      const dataDir = path.join(process.cwd(), 'data');
      try {
        await fs.access(dataDir);
      } catch {
        await fs.mkdir(dataDir, { recursive: true });
      }
      
      // Create a sample products file
      const sampleProducts = [
       
        {
          
        }
      ];
      
      await fs.writeFile(productsPath, JSON.stringify(sampleProducts, null, 2));
      console.log('Created sample products.json file');
    }
    
    const productsData = await fs.readFile(productsPath, 'utf8');
    const products = JSON.parse(productsData);

    // Create or update the products index
    const index = client.index('products');
    
    // Update index settings
    await index.updateSettings({
      searchableAttributes: [
        'name',
        'description',
        'category',
        'tags'
      ],
      filterableAttributes: [
        'category',
        'price',
        'inStock'
      ],
      sortableAttributes: [
        'price',
        'createdAt'
      ],
    });

    // Add documents to the index
    const response = await index.addDocuments(products);
    console.log('Products indexed successfully:', response);

  } catch (error) {
    console.error('Error indexing products:', error);
  }
}

// Run the indexing function
indexProducts();