import React, { useState } from 'react';
import { Star, MapPin, Clock, Heart, Search } from 'lucide-react';

interface Place {
  id: string;
  name: string;
  category: 'restaurant' | 'attraction' | 'hotel' | 'shopping' | 'nightlife';
  rating: number;
  reviewCount: number;
  priceLevel: 1 | 2 | 3 | 4;
  distance: string;
  openHours: string;
  image: string;
  description: string;
  tags: string[];
  coordinates: { lat: number; lng: number };
}

interface PlaceRecommendationsProps {
  currentTrip: any;
  setCurrentTrip: any;
  setRoute: any;
}

const PlaceRecommendations: React.FC<PlaceRecommendationsProps> = ({
  currentTrip,
  setCurrentTrip,
  setRoute
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'price'>('rating');

 const mockPlaces: Place[] = [
  {
    id: '1',
    name: 'St. Thomas Mount',
    category: 'attraction',
    rating: 4.8,
    reviewCount: 2847,
    priceLevel: 1,
    distance: '5 km',
    openHours: 'Sunrise or sunset',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/St._Thomas_Mount_railway_station_%28June_2025%29.jpg/960px-St._Thomas_Mount_railway_station_%28June_2025%29.jpg',
    description: 'A hillock offering panoramic views and a significant Christian site.',
    tags: ['Historical', 'Scenic', 'Pilgrimage'],
    coordinates: { lat: 13.0012, lng: 80.1790 }
  },
  {
    id: '2',
    name: 'Express Avenue Mall',
    category: 'shopping',
    rating: 4.5,
    reviewCount: 1452,
    priceLevel: 3,
    distance: '7 km',
    openHours: 'Afternoon',
    image: 'https://www.expressavenue.in/images/mall.jpg',
    description: 'Most Popular shopping mall with international brands and a multiplex.',
    tags: ['Shopping', 'Food', 'Entertainment'],
    coordinates: { lat: 13.0623, lng: 80.2510 }
  },
  {
    id: '3',
    name: 'Marina Beach',
    category: 'nightlife',
    rating: 4.7,
    reviewCount: 5621,
    priceLevel: 1,
    distance: '2 km',
    openHours: 'Evening',
    image: 'https://chennaitourism.travel/images/places-to-visit/headers/marina-beach-chennai-tourism-entry-fee-timings-holidays-reviews-header.jpg',
    description: 'One of the longest urban beaches in the world, great for evening strolls.',
    tags: ['Beach', 'Scenic', 'Photography'],
    coordinates: { lat: 13.0500, lng: 80.2820 }
  },
  {
    id: '4',
    name: 'Semmozhi Poonga',
    category: 'attraction',
    rating: 4.6,
    reviewCount: 842,
    priceLevel: 1,
    distance: '6 km',
    openHours: 'Morning',
    image: 'https://th-i.thgim.com/public/incoming/vtgt3w/article69053282.ece/alternates/FREE_1200/FLOWER%20SHOW%20EXHIBITION%20SEMMOZHI%20POONGA%20HORTICULTURE%20DEPT_18.jpg',
    description: 'Beautiful botanical garden with diverse plant species and walking paths.',
    tags: ['Park', 'Nature', 'Relaxing'],
    coordinates: { lat: 13.0510, lng: 80.2470 }
  },
  {
    id: '5',
    name: 'ITC Grand Chola Resort',
    category: 'hotel',
    rating: 4.9,
    reviewCount: 1034,
    priceLevel: 1,
    distance: '15 km',
    openHours: 'Evening',
    image: 'https://www.itchotels.com/content/dam/itchotels/in/umbrella/itc/hotels/itcgrandchola-chennai/images/overview/overview-desktop/exterior-dusk.png',
    description: 'High Quality Luxury resort offering spa, pool, and fine dining experiences.',
    tags: ['Resort', 'Luxury', 'Relaxation'],
    coordinates: { lat: 12.9883, lng: 80.2500 }
  },
  {
    id: '6',
    name: 'Phoenix Market City',
    category: 'attraction',
    rating: 4.5,
    reviewCount: 1921,
    priceLevel: 3,
    distance: '10 km',
    openHours: 'Afternoon',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Phoenix_Marketcity_in_Viman_Nagar%2C_Pune.jpg/1200px-Phoenix_Marketcity_in_Viman_Nagar%2C_Pune.jpg',
    description: 'Large shopping mall with a variety of dining and entertainment options.',
    tags: ['Shopping', 'Food', 'Entertainment'],
    coordinates: { lat: 13.0430, lng: 80.2430 }
  },
  {
    id: '7',
    name: 'Guindy National Park',
    category: 'attraction',
    rating: 4.6,
    reviewCount: 721,
    priceLevel: 1,
    distance: '8 km',
    openHours: 'Morning',
    image: 'https://s7ap1.scene7.com/is/image/incredibleindia/guindy-national-park-chennai-tamil-nadu-1-attr-hero?qlt=82&ts=1726655095978',
    description: 'A secure protected park in the city offering wildlife and nature trails.',
    tags: ['Wildlife', 'Nature', 'Walking'],
    coordinates: { lat: 13.0160, lng: 80.2240 }
  },
  // ✅ Added Places for Vellore, Bangalore, Sholinghur

{
  id: '8',
  name: 'Vellore Fort',
  category: 'attraction',
  rating: 4.6,
  reviewCount: 5120,
  priceLevel: 1,
  distance: '0 km',
  openHours: 'Morning - Evening',
  image: 'https://www.trawell.in/admin/images/upload/548011903Vellore_Fort_Main.jpg',
  description: 'A 16th-century fort with a moat, temples, mosque & historical significance.',
  tags: ['Heritage', 'Scenic', 'Photography'],
  coordinates: { lat: 12.9176, lng: 79.1325 }
},
{
  id: '9',
  name: 'Golden Temple Vellore',
  category: 'attraction',
  rating: 4.8,
  reviewCount: 13452,
  priceLevel: 2,
  distance: '10 km',
  openHours: 'Morning & Evening',
  image: 'https://i.pinimg.com/736x/00/26/b8/0026b89f387201bee380dd8bb3aa1c39.jpg',
  description: 'Famous spiritual destination known for its golden architecture.',
  tags: ['Pilgrimage', 'Architectural', 'Peaceful'],
  coordinates: { lat: 12.9172, lng: 79.1340 }
},
{
  id: '10',
  name: 'Ambur Star Briyani',
  category: 'restaurant',
  rating: 4.5,
  reviewCount: 8421,
  priceLevel: 2,
  distance: '30 km',
  openHours: 'Lunch - Dinner',
  image: 'https://static.where-e.com/United_Arab_Emirates/Ambur-Star-Biryani-Karama_536a0e769fad98535726d6f8dfda894b.jpg',
  description: 'Iconic biryani restaurant famous across South India.',
  tags: ['Food', 'Spicy', 'Popular'],
  coordinates: { lat: 12.7919, lng: 78.7167 }
},
{
  id: '11',
  name: 'Bangalore Palace',
  category: 'attraction',
  rating: 4.6,
  reviewCount: 29850,
  priceLevel: 3,
  distance: '0 km',
  openHours: 'Morning - Evening',
  image: 'https://www.fabhotels.com/blog/wp-content/uploads/2019/05/Bangalore-Palace_600.jpg',
  description: 'Royal architecture inspired by England’s Windsor Castle.',
  tags: ['Historical', 'Royal', 'Photography'],
  coordinates: { lat: 12.9987, lng: 77.5921 }
},
{
  id: '12',
  name: 'UB City Mall',
  category: 'shopping',
  rating: 4.7,
  reviewCount: 18890,
  priceLevel: 4,
  distance: '3 km',
  openHours: 'Afternoon - Evening',
  image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/e0/d9/9f/ub-city.jpg?w=1200&h=1200&s=1',
  description: 'Luxury shopping mall with top international brands & fine dining.',
  tags: ['Luxury', 'Nightlife', 'Dining'],
  coordinates: { lat: 12.9716, lng: 77.5962 }
},
{
  id: '13',
  name: 'Namma Ruchi Restaurant',
  category: 'restaurant',
  rating: 4.4,
  reviewCount: 5120,
  priceLevel: 2,
  distance: '4 km',
  openHours: 'Lunch - Dinner',
  image: 'https://b.zmtcdn.com/data/pictures/3/19683353/5bb5677a0a4ad903a067c3bbc56e2d44.jpg?fit=around|750:500&crop=750:500;*,*',
  description: 'Authentic Karnataka cuisine loved by locals.',
  tags: ['Food', 'South Indian', 'Family'],
  coordinates: { lat: 12.9611, lng: 77.6107 }
},
{
  id: '14',
  name: 'Toit Brewpub',
  category: 'nightlife',
  rating: 4.5,
  reviewCount: 12543,
  priceLevel: 3,
  distance: '5 km',
  openHours: 'Evening - Late Night',
  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdy6910fD4Rh1dppamT10eG9KXJ5ocHarW0g&s',
  description: 'Iconic brewery in Indiranagar with craft beer & live vibe.',
  tags: ['Nightlife', 'Music', 'Party'],
  coordinates: { lat: 12.9721, lng: 77.6408 }
},
{
  id: '15',
  name: 'Sholinghur Narasimha Swamy Temple',
  category: 'attraction',
  rating: 4.8,
  reviewCount: 14210,
  priceLevel: 1,
  distance: '25 km',
  openHours: 'Morning & Evening',
  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ51Qq_lnPWgS-j9DL38-TWB0oRULmOSvtdvQ&s',
  description: 'Hill temple with sacred significance and scenic climb of 1305 steps.',
  tags: ['Spiritual', 'Hillside', 'Pilgrimage'],
  coordinates: { lat: 13.1228, lng: 79.4266 }
},
{
  id: '17',
  name: 'Amirthi Zoological Park',
  category: 'attraction',
  rating: 4.4,
  reviewCount: 1830,
  priceLevel: 1,
  distance: '25 km',
  openHours: 'Morning – Evening',
  image: 'https://hblimg.mmtcdn.com/content/hubble/img/vellore/mmt/activities/m_Amirthi%20Zoological%20Park-5_l_340_454.jpg',
  description: 'Forest reserve with waterfalls, walking trails and wildlife near Vellore.',
  tags: ['Nature', 'Waterfall', 'Hiking'],
  coordinates: { lat: 12.9150, lng: 79.3320 }
},
{
  id: '18',
  name: 'Jalakandeswarar Temple (Vellore Fort)',
  category: 'attraction',
  rating: 4.5,
  reviewCount: 4290,
  priceLevel: 1,
  distance: '0.5 km',
  openHours: '06:00 – 20:00',
  image: 'https://thetempleguru.com/wp-content/uploads/2023/10/jalakandeswarar-temple-vellore-16.jpg',
  description: 'Historic Hindu temple inside Vellore Fort built in Vijayanagara style.',
  tags: ['Temple', 'Heritage', 'Architecture'],
  coordinates: { lat: 12.9175, lng: 79.1328 }
},
{
  id: '19',
  name: 'Palamathi Hills / Yelagiri Viewpoint',
  category: 'attraction',
  rating: 4.6,
  reviewCount: 2100,
  priceLevel: 2,
  distance: '40 km',
  openHours: 'Morning – Sunset',
  image: 'https://www.holidayhometimes.com/wp-content/uploads/2013/05/HHT-yercaud.jpg',
  description: 'Hill station area with scenic viewpoints, trekking and nature near Vellore.',
  tags: ['Hill Station', 'Scenic', 'Trekking'],
  coordinates: { lat: 12.6220, lng: 78.6700 }
},
{
  id: '20',
  name: 'St. John’s Church Vellore Fort Campus',
  category: 'attraction',
  rating: 4.3,
  reviewCount: 860,
  priceLevel: 1,
  distance: '0.4 km',
  openHours: '08:00 – 18:00',
  image: 'https://www.holidify.com/images/cmsuploads/compressed/qweqw_20181214170144_20181214170153.jpg',
  description: 'One of the oldest churches in the area inside Vellore Fort campus, built in 1846.',
  tags: ['Church', 'Heritage', 'Quiet'],
  coordinates: { lat: 12.9170, lng: 79.1315 }
},
{
  id: '21',
  name: 'Periyar Park Vellore',
  category: 'attraction',
  rating: 4.2,
  reviewCount: 1290,
  priceLevel: 1,
  distance: '3 km',
  openHours: 'Morning – Evening',
  image: 'https://vushii.com/uploads/758874526_Periyar%20Park.jpg',
  description: 'Family-friendly park with kids play area, lake and greenery in Vellore city.',
  tags: ['Family', 'Park', 'Relaxing'],
  coordinates: { lat: 12.9145, lng: 79.1370 }
},
{
  id: '22',
  name: 'Vainu Bappu Observatory (Kavalur)',
  category: 'attraction',
  rating: 4.1,
  reviewCount: 540,
  priceLevel: 2,
  distance: '35 km',
  openHours: '10:00 – 17:00 (Mon-Fri)',
  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7WX1amn8YgjudQTDZMbPpCs1Leuqgkhw7kg&s',
  description: 'Astronomical observatory near Vellore, known for large telescope and stargazing.',
  tags: ['Science', 'Observatory', 'Nature'],
  coordinates: { lat: 12.6370, lng: 78.7060 }
},
{
  id: '23',
  name: 'Kannamangalam Hill Fort Trek',
  category: 'attraction',
  rating: 4.0,
  reviewCount: 400,
  priceLevel: 1,
  distance: '28 km',
  openHours: 'Sunrise – Afternoon',
  image: 'https://media1.thrillophilia.com/filestore/tnkj7f5ohnt50cpb5m8u8rjw3znz_1584427030_shutterstock_1103673470.jpg?w=400&dpr=2',
  description: 'Local hillside fort & trekking spot offering views over Vellore region.',
  tags: ['Trekking', 'Viewpoint', 'Adventure'],
  coordinates: { lat: 12.8280, lng: 78.9560 }
},
{
  id: '24',
  name: 'Nandi Hills',
  category: 'attraction',
  rating: 4.4,
  reviewCount: 16250,
  priceLevel: 2,
  distance: '60 km',
  openHours: 'Early Morning – Afternoon',
  image: 'https://media1.thrillophilia.com/filestore/08bgi6nl7py2efzqk2wi9d4z936l_shutterstock-652879897.jpg',
  description: 'Scenic hill station near Bengaluru popular for sunrise views and trekking. ',
  tags: ['Hill Station', 'Sunrise', 'Nature'],
  coordinates: { lat: 13.3700, lng: 77.6830 }
},
{
  id: '25',
  name: 'Tipu Sultan’s Summer Palace',
  category: 'attraction',
  rating: 4.3,
  reviewCount: 5400,
  priceLevel: 1,
  distance: '1 km',
  openHours: '10:00 – 17:30',
  image: 'https://pohcdn.com/sites/default/files/styles/paragraph__hero_banner__hb_image__1880bp/public/hero_banner/Sultan_Tipu_Palace.jpg',
  description: 'Wooden palace of Tipu Sultan with historical significance in Bengaluru.',
  tags: ['History', 'Architecture', 'Palace'],
  coordinates: { lat: 12.9518, lng: 77.5700 }
},
{
  id: '26',
  name: 'Commercial Street',
  category: 'shopping',
  rating: 4.2,
  reviewCount: 22340,
  priceLevel: 3,
  distance: '2 km',
  openHours: '10:00 – 22:00',
  image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Commercial_Street%2C_Bangalore_%287870987476%29.jpg/1200px-Commercial_Street%2C_Bangalore_%287870987476%29.jpg',
  description: 'Busy shopping street in central Bengaluru offering clothes, accessories and more.',
  tags: ['Shopping', 'Street Market', 'Bargain'],
  coordinates: { lat: 12.9780, lng: 77.6035 }
},
{
  id: '27',
  name: 'VV Puram Food Street',
  category: 'restaurant',
  rating: 4.5,
  reviewCount: 14780,
  priceLevel: 2,
  distance: '3 km',
  openHours: 'Evening – Late Night',
  image: 'https://res.cloudinary.com/dyiffrkzh/image/upload/c_fill,f_auto,fl_progressive.strip_profile,g_center,h_180,q_auto,w_300/v1696318527/bbj/hsfu6hwayk86b2s3cuno.jpg',
  description: 'Famous street food hub in Bengaluru, ideal for dinner & late night eats.',
  tags: ['Food', 'Street Food', 'Evening'],
  coordinates: { lat: 12.9522, lng: 77.5600 }
},
{
  id: '28',
  name: 'Wonderla Amusement Park',
  category: 'attraction',
  rating: 4.4,
  reviewCount: 12890,
  priceLevel: 3,
  distance: '28 km',
  openHours: '10:30 – 18:00',
  image: 'https://www.prestigesouthernstar.info/images/prestige/wonderla-amusement-park.webp',
  description: 'Popular amusement & water park near Bengaluru for families and fun.',
  tags: ['Theme Park', 'Water Park', 'Family'],
  coordinates: { lat: 12.8950, lng: 77.4350 }
},
{
  id: '29',
  name: 'Shivoham Shiva Temple',
  category: 'attraction',
  rating: 4.3,
  reviewCount: 7680,
  priceLevel: 1,
  distance: '4 km',
  openHours: '06:00 – 21:00',
  image: 'https://templeinkarnataka.com/wp-content/uploads/2024/08/Shivoham-Shiva-Temple-Bangalore1.jpg',
  description: 'Large Shiva statue with serene temple atmosphere in Bengaluru’s Old Airport Road area.',
  tags: ['Temple', 'Spiritual', 'Quiet'],
  coordinates: { lat: 12.9550, lng: 77.6500 }
},
{
  id: '30',
  name: 'MG Road & Brigade Road Area',
  category: 'shopping',
  rating: 4.1,
  reviewCount: 19800,
  priceLevel: 3,
  distance: '0 km',
  openHours: '10:00 – 23:00',
  image: 'https://media1.thrillophilia.com/filestore/0yto6oomqhgs89ruc1hce8l930re_1562757500_Brigade_Road_Bangalore.jpg',
  description: 'Iconic boulevard in Bengaluru with shops, restaurants and nightlife.',
  tags: ['Shopping', 'Nightlife', 'Dining'],
  coordinates: { lat: 12.9789, lng: 77.5900 }
}
  ];

  // ✅ New Function — Add Place to Trip Planner
  const handleAddToTrip = (place: Place) => {
    const newTrip = {
      ...currentTrip,
      places: [...(currentTrip?.places || []), place],
      to: place.name,
      coordinates: place.coordinates
    };

    setCurrentTrip(newTrip);
    setRoute({
      ...newTrip,
      from: currentTrip?.from || "",
      to: place.name,
      toCoords: place.coordinates
    });

    alert(`${place.name} added to trip!`);
  };

  const categories = {
    all: { label: 'All Places' },
    restaurant: { label: 'Restaurants'},
    attraction: { label: 'Attractions'},
    hotel: { label: 'Hotels'},
    shopping: { label: 'Shopping'},
    nightlife: { label: 'Nightlife'}
  };

  const filteredPlaces = mockPlaces
    .filter(place => 
      (selectedCategory === 'all' || place.category === selectedCategory) &&
      (searchQuery === '' ||
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        case 'price':
          return a.priceLevel - b.priceLevel;
        default:
          return 0;
      }
    });

  const toggleFavorite = (placeId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(placeId)) newFavorites.delete(placeId);
    else newFavorites.add(placeId);
    setFavorites(newFavorites);
  };

  const getPriceLevel = (level: number) => '$'.repeat(level);

  const getRatingColor = (rating: number) =>
    rating >= 4.5 ? 'text-green-600' : rating >= 4.0 ? 'text-yellow-600' : 'text-orange-600';

  return (
    <div className="space-y-6">
      {/* ✅ Search + Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Discover Places</h2>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 w-64"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="rating">Sort by Rating</option>
              <option value="distance">Sort by Distance</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </div>

        {/* ✅ Category Filters */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedCategory === key ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Place Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaces.map((place) => (
          <div key={place.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl">
            <div className="relative">
              <img src={place.image} alt={place.name} className="w-full h-48 object-cover" />
            
              <button
                onClick={() => toggleFavorite(place.id)}
                className={`absolute top-3 right-3 p-2 rounded-full ${
                  favorites.has(place.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600 hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorites.has(place.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 text-lg">{place.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{place.description}</p>

              <div className="flex items-center justify-between text-sm mb-4">
                <span className={`${getRatingColor(place.rating)} font-medium`}>
                  ⭐ {place.rating} ({place.reviewCount})
                </span>
                <span className="text-gray-500">{place.distance}</span>
              </div>

              {/* ✅ Add to Trip Button */}
              <button
                onClick={() => handleAddToTrip(place)}
                className="w-full bg-teal-500 text-white py-2 rounded-lg font-medium hover:bg-teal-600"
              >
                Add to Trip
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPlaces.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No places found. Try a different filter.
        </div>
      )}
    </div>
  );
};

export default PlaceRecommendations;
