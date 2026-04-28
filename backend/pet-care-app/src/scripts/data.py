import json
import uuid
import random
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any, Optional
import os


# CONFIGURATION
DATA_DIR = Path(__file__).parent.parent / "data" # directory to save JSON files
DATA_SIZE = 50  # Number of owners to generate
SEED = 42 
random.seed(SEED)


# LOAD BREED DATA FROM KAGGLE DATASET
def load_kaggle_breeds():
    """Load real breed names from Kaggle dataset folder structure"""
    kaggle_images_path = Path(__file__).parent.parent / "datasets" / "stanford-dogs-dataset" / "images" / "Images"
    
    if kaggle_images_path.exists():
        # Get all breed folders from Kaggle dataset
        breeds = []
        breed_images = {}
        
        for breed_folder in sorted(kaggle_images_path.iterdir()):
            if breed_folder.is_dir():
                # Folder names like: n02084442-German_shepherd_dog
                folder_name = breed_folder.name
                # Extract breed name from folder
                breed_name = folder_name.split('-', 1)[1].replace('_', ' ') if '-' in folder_name else folder_name
                
                # Get first image for this breed
                images = list(breed_folder.glob('*.jpg'))
                if images:
                    breeds.append(breed_name)
                    breed_images[breed_name] = str(images[0])  # Store path to first image
        
        if breeds:
            print(f"Loaded {len(breeds)} breeds from Kaggle dataset")
            return breeds, breed_images
    
    # Fallback to hardcoded breeds if dataset not available
    print("Kaggle dataset not found, using fallback breeds")
    return [
        "Labrador Retriever", "German Shepherd", "Golden Retriever", "Bulldog",
        "Poodle", "Beagle", "Yorkshire Terrier", "German Shorthaired Pointer",
        "Dachshund", "Husky", "Goldendoodle", "Chihuahua", "Boxer", "Rottweiler",
        "Pug", "Cocker Spaniel", "French Bulldog", "Great Dane", "Maltese",
        "Shih Tzu", "Boston Terrier", "Schnauzer", "Bernese Mountain Dog",
        "Corgi", "Pomeranian", "Malamute", "Akita", "Dalmatian", "Collie",
        "Springer Spaniel", "Samoyed", "Newfoundland", "Portuguese Water Dog"
    ], {}

DOG_BREEDS, BREED_IMAGES = load_kaggle_breeds()

PET_NAMES = [
    "Max", "Bella", "Charlie", "Lucy", "Cooper", "Daisy", "Buddy", "Molly",
    "Bailey", "Sophie", "Rocky", "Sadie", "Duke", "Chloe", "Buster", "Lucy",
    "Tucker", "Maggie", "Simba", "Emma", "Milo", "Lola", "Teddy", "Bailey",
    "Murphy", "Coco", "Zeus", "Zoe", "Rex", "Sweetie", "Rufus", "Rosie"
]

VACCINE_NAMES = [
    "Rabies", "DHPP (Distemper)", "Bordetella", "Leptospirosis",
    "Lyme Disease", "Parvovirus", "Parainfluenza"
]

OWNER_FIRST_NAMES = [
    "James", "Mary", "Robert", "Patricia", "Michael", "Jennifer", "William",
    "Linda", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
    "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy"
]

OWNER_LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
    "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
    "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"
]

PROVIDER_FIRST_NAMES = [
    "Emma", "Liam", "Olivia", "Noah", "Ava", "Ethan", "Sophia", "Mason",
    "Isabella", "Logan", "Mia", "Lucas", "Harper", "Benjamin", "Amelia"
]

SERVICE_TYPES = ["DOG_WALKING", "VACCINATION", "GENERAL_SERVICE"]
GENDERS = ["MALE", "FEMALE"]

# WEIGHT RANGES BY BREED
def get_weight_range(breed):
    """Get typical weight range for breed"""
    small = (2, 10)
    medium = (10, 25)
    large = (25, 50)
    xlarge = (50, 80)
    
    breed_lower = breed.lower()
    
    if any(x in breed_lower for x in ['chihuahua', 'pomeranian', 'maltese', 'shih', 'terrier', 'yorkie']):
        return small
    elif any(x in breed_lower for x in ['beagle', 'pug', 'bulldog', 'spaniel', 'schnauzer', 'shiba']):
        return medium
    elif any(x in breed_lower for x in ['labrador', 'golden', 'shepherd', 'boxer', 'collie', 'corgi', 'doberman', 'pitbull']):
        return large
    elif any(x in breed_lower for x in ['great', 'dane', 'rottweiler', 'husky', 'malamute', 'bernese', 'newfoundland', 'akita']):
        return xlarge
    else:
        return medium

def generate_weight(breed):
    """Generate realistic weight for breed"""
    min_weight, max_weight = get_weight_range(breed)
    return round(random.uniform(min_weight, max_weight), 1)

def get_breed_image_url(breed):
    """Get image URL - prefers real Kaggle images, falls back to URLs"""
    # First check if we have a real Kaggle image for this breed
    if breed in BREED_IMAGES:
        return BREED_IMAGES[breed]
    
    # Fallback to online images
    breed_normalized = breed.lower().replace(" ", "_")
    placeholder_urls = {
        "labrador retriever": "https://upload.wikimedia.org/wikipedia/commons/3/34/Labrador_on_Quantock_%282175262184%29.jpg",
        "golden retriever": "https://upload.wikimedia.org/wikipedia/commons/1/18/Dog_Breeds.jpg",
        "german shepherd": "https://upload.wikimedia.org/wikipedia/commons/d/d0/German_Shepherd_-_DSC_4797_%289096293140%29.jpg",
        "bulldog": "https://upload.wikimedia.org/wikipedia/commons/5/55/E_D_note_%28by%29.jpg",
    }
    
    return placeholder_urls.get(breed_normalized.replace("_", " "), "https://via.placeholder.com/300x300?text=Pet+Image")

# 
# UTILITY FUNCTIONS
def generate_uuid():
    """Generate UUID v4"""
    return str(uuid.uuid4())

def hash_password(password):
    """Hash password with SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def random_date(start_date=None, end_date=None):
    """Generate random datetime"""
    if start_date is None:
        start_date = datetime.now() - timedelta(days=365*3)
    if end_date is None:
        end_date = datetime.now()
    
    time_between = (end_date - start_date).total_seconds()
    random_seconds = random.randint(0, int(time_between))
    return (start_date + timedelta(seconds=random_seconds)).isoformat()

def random_past_date(days_back=365):
    """Generate random past date"""
    date = datetime.now() - timedelta(days=random.randint(0, days_back))
    return date.isoformat()

# DATA GENERATION FUNCTIONS
def generate_users(count):
    """Generate user records"""
    users = []
    for i in range(count):
        role = random.choice(["OWNER", "PROVIDER"])
        users.append({
            "id": generate_uuid(),
            "email": f"user{i+1}@petmgmt.com",
            "passwordHash": hash_password(f"password{i+1}"),
            "role": role,
            "isFirstLogin": random.choice([True, False]),
            "createdAt": random_past_date(365),
            "updatedAt": random_past_date(30)
        })
    return users

def generate_owner_profiles(users, owner_count):
    """Generate owner profile records"""
    owner_users = [u for u in users if u["role"] == "OWNER"][:owner_count]
    profiles = []
    
    for user in owner_users:
        profiles.append({
            "id": generate_uuid(),
            "userId": user["id"],
            "fullName": f"{random.choice(OWNER_FIRST_NAMES)} {random.choice(OWNER_LAST_NAMES)}",
            "phoneNumber": f"+1{random.randint(2000000000, 9999999999)}",
            "profileImage": f"https://via.placeholder.com/200x200?text=Owner",
            "createdAt": random_past_date(365),
            "updatedAt": random_past_date(30)
        })
    return profiles

def generate_provider_profiles(users):
    """Generate provider profile records"""
    provider_users = [u for u in users if u["role"] == "PROVIDER"]
    profiles = []
    
    for user in provider_users:
        profiles.append({
            "id": generate_uuid(),
            "userId": user["id"],
            "fullName": f"{random.choice(PROVIDER_FIRST_NAMES)} {random.choice(OWNER_LAST_NAMES)}",
            "phoneNumber": f"+1{random.randint(2000000000, 9999999999)}",
            "hourlyPayment": round(random.uniform(15, 50), 2),
            "gender": random.choice(GENDERS),
            "serviceType": random.choice(SERVICE_TYPES),
            "bio": f"Professional pet care provider with {random.randint(2, 15)} years of experience",
            "profileImage": f"https://via.placeholder.com/200x200?text=Provider",
            "createdAt": random_past_date(365),
            "updatedAt": random_past_date(30)
        })
    return profiles

def generate_pets(owners):
    """Generate pet records WITH KAGGLE BREED DATA AND IMAGES"""
    pets = []
    
    for owner_idx, owner in enumerate(owners):
        num_pets = random.randint(1, 3)
        for _ in range(num_pets):
            breed = random.choice(DOG_BREEDS)  # KAGGLE: BREED
            pets.append({
                "id": generate_uuid(),
                "ownerId": owner["id"],
                "name": random.choice(PET_NAMES),
                "breed": breed,  #FROM KAGGLE BREEDS
                "age": random.randint(1, 15),
                "weight": generate_weight(breed),  #BREED-SPECIFIC
                "gender": random.choice(GENDERS),
                "photoUrl": get_breed_image_url(breed),  #KAGGLE IMAGE
                "createdAt": random_past_date(365),
                "updatedAt": random_past_date(30)
            })
    return pets

def generate_vaccination_records(pets, providers):
    """Generate vaccination records"""
    records = []
    for pet in pets:
        num_vaccinations = random.randint(2, 5)
        for _ in range(num_vaccinations):
            vax_date = datetime.now() - timedelta(days=random.randint(30, 600))
            next_due = vax_date + timedelta(days=365)
            
            records.append({
                "id": generate_uuid(),
                "petId": pet["id"],
                "vaccineName": random.choice(VACCINE_NAMES),
                "vaccinationDate": vax_date.isoformat(),
                "nextDueDate": next_due.isoformat(),
                "addedByProviderId": random.choice(providers)["id"] if providers else None,
                "isApproved": random.choice([True, False]),
                "createdAt": random_past_date(180)
            })
    return records

def generate_weight_records(pets, providers):
    """Generate weight tracking records"""
    records = []
    for pet in pets:
        num_records = random.randint(5, 15)
        for _ in range(num_records):
            records.append({
                "id": generate_uuid(),
                "petId": pet["id"],
                "weight": generate_weight(pet["breed"]),
                "recordDate": random_past_date(365),
                "addedByProviderId": random.choice(providers)["id"] if providers else None,
                "isApproved": random.choice([True, False]),
                "createdAt": random_past_date(365)
            })
    return records

def generate_hire_requests(owners, providers):
    """Generate hire request records"""
    requests = []
    for owner in owners:
        num_requests = random.randint(0, 2)
        for _ in range(num_requests):
            requests.append({
                "id": generate_uuid(),
                "ownerId": owner["id"],
                "providerId": random.choice(providers)["id"] if providers else generate_uuid(),
                "status": random.choice(["PENDING", "APPROVED", "REJECTED"]),
                "message": f"I need {random.choice(SERVICE_TYPES)} services for my pet",
                "createdAt": random_past_date(180),
                "updatedAt": random_past_date(90)
            })
    return requests

def generate_bookings(owners, providers, pets):
    """Generate booking records"""
    bookings = []
    for owner in owners:
        num_bookings = random.randint(1, 3)
        for _ in range(num_bookings):
            start = datetime.now() + timedelta(days=random.randint(1, 30))
            end = start + timedelta(hours=random.randint(1, 4))
            
            bookings.append({
                "id": generate_uuid(),
                "ownerId": owner["id"],
                "providerId": random.choice(providers)["id"] if providers else generate_uuid(),
                "petId": random.choice([p for p in pets if p["ownerId"] == owner["id"]])["id"] if any(p["ownerId"] == owner["id"] for p in pets) else generate_uuid(),
                "serviceType": random.choice(SERVICE_TYPES),
                "startDate": start.isoformat(),
                "endDate": end.isoformat(),
                "time": f"{random.randint(8, 18)}:00",
                "status": random.choice(["PENDING", "CONFIRMED", "COMPLETED"]),
                "createdAt": random_past_date(365),
                "updatedAt": random_past_date(30)
            })
    return bookings

def generate_messages(users):
    """Generate message records"""
    messages = []
    for _ in range(50):
        sender = random.choice(users)
        receiver = random.choice([u for u in users if u["id"] != sender["id"]])
        
        messages.append({
            "id": generate_uuid(),
            "senderUserId": sender["id"],
            "receiverUserId": receiver["id"],
            "messageText": f"Hi, I have a question about pet care services",
            "isRead": random.choice([True, False]),
            "createdAt": random_past_date(180)
        })
    return messages



def generate_provider_pet_assignments(providers, owners, pets):
    """Generate provider-pet assignments"""
    assignments = []
    for provider in providers:
        num_assignments = random.randint(1, 3)
        for _ in range(num_assignments):
            owner = random.choice(owners)
            owner_pets = [p for p in pets if p["ownerId"] == owner["id"]]
            if owner_pets:
                assignments.append({
                    "id": generate_uuid(),
                    "providerId": provider["id"],
                    "ownerId": owner["id"],
                    "petId": random.choice(owner_pets)["id"],
                    "hireRequestId": generate_uuid(),
                    "isActive": random.choice([True, False]),
                    "createdAt": random_past_date(180)
                })
    return assignments


class DataGenerator:
    
    def __init__(self, data_size=DATA_SIZE):
        self.data_size = data_size
        self.data = {}
    
    def generate_all(self):
        """Generate all data"""
        print(f"Generating data for {self.data_size} owners...\n")
        
        # Generate users
        user_count = self.data_size + random.randint(20, 40)
        self.data['users'] = generate_users(user_count)
        print(f"Generated {len(self.data['users'])} users")
        
        # Generate profiles
        self.data['owner_profiles'] = generate_owner_profiles(self.data['users'], self.data_size)
        print(f"Generated {len(self.data['owner_profiles'])} owner profiles")
        
        self.data['provider_profiles'] = generate_provider_profiles(self.data['users'])
        print(f"Generated {len(self.data['provider_profiles'])} provider profiles")
        
        # Generate pets WITH KAGGLE BREEDS AND IMAGES
        self.data['pets'] = generate_pets(self.data['owner_profiles'])
        print(f"Generated {len(self.data['pets'])} pets WITH KAGGLE BREED & IMAGE DATA")
        
        # Generate related records
        self.data['vaccination_records'] = generate_vaccination_records(
            self.data['pets'], self.data['provider_profiles']
        )
        print(f"Generated {len(self.data['vaccination_records'])} vaccination records")
        
        self.data['weight_records'] = generate_weight_records(
            self.data['pets'], self.data['provider_profiles']
        )
        print(f"Generated {len(self.data['weight_records'])} weight records")
        
        self.data['hire_requests'] = generate_hire_requests(
            self.data['owner_profiles'], self.data['provider_profiles']
        )
        print(f"Generated {len(self.data['hire_requests'])} hire requests")
        
        self.data['provider_pet_assignments'] = generate_provider_pet_assignments(
            self.data['provider_profiles'], self.data['owner_profiles'], self.data['pets']
        )
        print(f"Generated {len(self.data['provider_pet_assignments'])} provider-pet assignments")
        
        self.data['bookings'] = generate_bookings(
            self.data['owner_profiles'], self.data['provider_profiles'], self.data['pets']
        )
        print(f"Generated {len(self.data['bookings'])} bookings")
        
        self.data['messages'] = generate_messages(self.data['users'])
        print(f"Generated {len(self.data['messages'])} messages")
    
    def save_all(self):
        """Save all generated data to JSON files"""
        print("Saving data to JSON files...\n")
        
        for name, data in self.data.items():
            filepath = DATA_DIR / f"{name}.json"
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2)
        
        print("ALL DATA GENERATED AND SAVED SUCCESSFULLY!")
        
        # Show statistics
        print("\nFINAL STATISTICS:")
        print("-"*80)
        total_records = sum(len(v) for v in self.data.values())
        for key, value in self.data.items():
            print(f"  {key:.<30} {len(value):>4} records")
        print(f"  {'TOTAL':.<30} {total_records:>4} records")
        print("\n")


# CLI - MAIN ENTRY POINT
if __name__ == '__main__':
    # Check if data files exist
    data_files = ['users.json', 'pets.json', 'owner_profiles.json']
    files_exist = all((DATA_DIR / f).exists() for f in data_files)
    
    if not files_exist:
        print("JSON files not found, generating data...\n")
        generator = DataGenerator(DATA_SIZE)
        generator.generate_all()
        generator.save_all()
    else:
        print("Data files already exist!")
        print("To regenerate, delete JSON files and run again.\n")
