const Listing = require('../Models/listing');

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render('listings/new');   
}

module.exports.showListing = async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        })
        .populate("owner")
    if(!listing) {
        req.flash("error", "Listing you requestd for does not exist!");
        res.redirect('/listings');
    }
    res.render('listings/show', { listing });
}

module.exports.createListing = async(req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, "..", filename);
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename}
    // Server-side geocoding and geometry storage
    if (newListing.location && newListing.country) {
        try {
            const q = encodeURIComponent(`${newListing.location}, ${newListing.country}`);
            const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}`, {
                headers: { 'User-Agent': 'StayHive-app/1.0' }
            });
            const data = await resp.json();
            if (Array.isArray(data) && data[0]) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
                    newListing.geometry = { type: 'Point', coordinates: [lon, lat] };
                }
            }
        } catch (e) {
            // ignore geocoding failure; listing can still be created
        }
    }
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.editListing = async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requestd for does not exist!");
        res.redirect('/listings');
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    console.log(originalImageUrl);
    res.render('listings/edit', { listing, originalImageUrl });
}

module.exports.updateListing = async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    
    if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    }
    // Update geometry when location/country change
    if (listing.location && listing.country) {
        try {
            const q = encodeURIComponent(`${listing.location}, ${listing.country}`);
            const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}`, {
                headers: { 'User-Agent': 'StayHive-app/1.0' }
            });
            const data = await resp.json();
            if (Array.isArray(data) && data[0]) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
                    listing.geometry = { type: 'Point', coordinates: [lon, lat] };
                    await listing.save();
                }
            }
        } catch (e) {
            // ignore geocoding failure
        }
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async(req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect('/listings');
}

module.exports.searchListings = async(req, res) => {
    const city = req.query.city?.trim();

    try {
        const filteredListings = await Listing.find({
            location: {$regex: new RegExp(city, 'i')}
        });
        if(filteredListings.length === 0) {
            req.flash("error", "No listings found for the specified city.");
            return res.redirect("/listings");
        }
        res.render("listings/index", { allListings: filteredListings });
    }catch{
        req.flash("error", "Error occurred while searching listings.");
        res.redirect("/listings");
    }
}