const fs = require("node:fs/promises");
const path = require("node:path");
const { nanoid } = require("nanoid");

const appartmentsPath = path.join(__dirname, "appartments.json");

const readAppartments = async () => {
    const appartments = await fs.readFile(appartmentsPath,"utf-8");
    return JSON.parse(appartments);
}

const writeAppartments = async (appartments) => {
    await fs.writeFile(appartmentsPath, JSON.stringify(appartments,null,2));
}

const getAllAppartments = async () => {
    const appartments = await readAppartments();
    return appartments;
}

const getAppartmentById = async (id) => {
    const appartments =await readAppartments();
    const appartment = appartments.find((appartment) => (appartment.id === id));
    return appartment || null;
}

const addNewAppartment = async (newAppartment) => {
    const appartments = await readAppartments();
    appartments.push({
        id:nanoid(),
        ...newAppartment
    });
    await writeAppartments(appartments);
    return newAppartment;
}

const updateAppartmentById = async (id, updateAppartment) => {
    const appartments = await readAppartments();
    const index = appartments.findIndex(appartment => appartment.id === id);
    if (index === -1) {
        return null
    }
    appartments[index] = { id, ...updateAppartment };
    await writeAppartments(appartments);
    return appartments[index];
}

const deleteAppartmentByID = async (id) => {
    const appartments = await readAppartments();
    const index = appartments.findIndex(appartment => appartment.id === id);
    if (index === -1) {
        return null
    }
    const [result] = appartments.splice(index, 1);
    await writeAppartments(appartments);
    return result;
}

module.exports = {
    getAllAppartments,
    getAppartmentById,
    addNewAppartment,
    updateAppartmentById,
    deleteAppartmentByID,
}