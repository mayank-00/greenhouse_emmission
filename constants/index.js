const categoryDescriptionNameMapping = {
    "carbon_dioxide_co2_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent": "carbon_dioxide_without_land_use",
    "greenhouse_gas_ghgs_emissions_including_indirect_co2_without_lulucf_in_kilotonne_co2_equivalent": "greenhouse_gas_including_indirect_co2",
    "greenhouse_gas_ghgs_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent": "greenhouse_gas_without_land_use",
    "hydrofluorocarbons_hfcs_emissions_in_kilotonne_co2_equivalent": "hydrofluorocarbons",
    "methane_ch4_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent": "methane_without_land_use",
    "nitrogen_trifluoride_nf3_emissions_in_kilotonne_co2_equivalent": "nitrogen_trifluoride",
    "nitrous_oxide_n2o_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent": "nitrous_oxide_without_land_use",
    "perfluorocarbons_pfcs_emissions_in_kilotonne_co2_equivalent": "perfluorocarbons",
    "sulphur_hexafluoride_sf6_emissions_in_kilotonne_co2_equivalent": "sulphur_hexafluoride",
    "unspecified_mix_of_hydrofluorocarbons_hfcs_and_perfluorocarbons_pfcs_emissions_in_kilotonne_co2_equivalent": "unspecified_mix_of_hydrofluorocarbons_and_perfluorocarbons",
}

const errorMessages = {
    'serverError': "Internal Server Error",
    'invalidInputs': "Invalid input provided"
}

module.exports = {
    categoryDescriptionNameMapping,
    errorMessages
}