import json
import os
from collections import defaultdict

# Load all locale files
locales = {}
locale_files = ["en.json", "mm.json", "th.json", "cn.json"]
base_path = "src/i18n/locales/"

for file in locale_files:
    file_path = os.path.join(base_path, file)
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            locales[file.replace(".json", "")] = json.load(f)


# Function to flatten nested dictionary
def flatten_dict(d, parent_key="", sep="."):
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)


# Flatten all locale dictionaries
flattened_locales = {}
for locale, data in locales.items():
    flattened_locales[locale] = flatten_dict(data)

# Find all unique keys across all locales
all_keys = set()
for locale_data in flattened_locales.values():
    all_keys.update(locale_data.keys())

# Find missing keys in each locale
missing_translations = defaultdict(list)
for key in sorted(all_keys):
    for locale in locale_files:
        locale_name = locale.replace(".json", "")
        if (
            locale_name in flattened_locales
            and key not in flattened_locales[locale_name]
        ):
            missing_translations[locale_name].append(key)

# Print results
print("Missing translations by locale:")
print("=" * 50)
for locale, missing_keys in missing_translations.items():
    if missing_keys:
        print(f"\n{locale.upper()} ({len(missing_keys)} missing):")
        for key in missing_keys:
            # Find which locale has this key to show reference
            reference_locale = None
            reference_value = None
            for ref_locale, ref_data in flattened_locales.items():
                if key in ref_data:
                    reference_locale = ref_locale
                    reference_value = ref_data[key]
                    break
            print(f'  - {key} (ref: {reference_locale}: "{reference_value}")')

# Generate missing translations for each locale
print("\n\n" + "=" * 80)
print("MISSING TRANSLATIONS TO ADD:")
print("=" * 80)

for locale, missing_keys in missing_translations.items():
    if missing_keys:
        print(f"\n>>> {locale.upper()} MISSING TRANSLATIONS:")
        print("-" * 40)
        for key in missing_keys:
            # Find reference value from English if available, otherwise from any locale
            reference_value = None
            if "en" in flattened_locales and key in flattened_locales["en"]:
                reference_value = flattened_locales["en"][key]
            else:
                for ref_locale, ref_data in flattened_locales.items():
                    if key in ref_data:
                        reference_value = ref_data[key]
                        break

            print(f'"{key}": "{reference_value}",')
