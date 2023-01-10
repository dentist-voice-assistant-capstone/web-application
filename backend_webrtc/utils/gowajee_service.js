const decoder = require('../pbs/decoder_type_pb');
const encoder = require('../pbs/audio_pb');

function init_streaming_request() {
    // Gowajee API
    // Initialize Transcribe Config for API (set to default)
    transcribeConfig = {
        // language_code: "th-TH",
        decoder_type: decoder.DecoderType.LMBEAMSEARCH,
        get_word_timestamps: false,
        get_speaking_rate: false,
        word_list: [],
    };

    // Initialize Streaming Config for API (set to default)
    streamingConfig = {
        transcribe_config: transcribeConfig,
        encoding: encoder.AudioEncoding.LINEAR_PCM,
        sample_rate: RATE,
        num_channels: 0,
    };

    // Create request and set streaming config
    request = {
        streaming_config: streamingConfig,
        audio_data: null,
        is_final: false,
    };
    return request;
}

module.exports = { init_streaming_request };